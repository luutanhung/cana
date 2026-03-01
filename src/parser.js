import { createLogger } from "vite";
import {
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  Program,
  ReturnStatement,
} from "./ast.js";
import { TokenType } from "./token.js";

export const Precedence = Object.freeze({
  LOWEST: 1,
  EQUALS: 2, // ==
  LESSGREATER: 3, // < or >
  SUM: 4, // +
  PRODUCT: 5, // *
  PREFIX: 6, // -X or !X
  CALL: 7, // myFunction()
});

export const precedences = new Map([
  [TokenType.EQ, Precedence.EQUALS],
  [TokenType.NOT_EQ, Precedence.EQUALS],
  [TokenType.LT, Precedence.LESSGREATER],
  [TokenType.GT, Precedence.LESSGREATER],
  [TokenType.PLUS, Precedence.SUM],
  [TokenType.MINUS, Precedence.SUM],
  [TokenType.SLASH, Precedence.PRODUCT],
  [TokenType.ASTERISK, Precedence.PRODUCT],
]);
/**
 * type PrefixParseFunc = () => Expression;
 * type InfixParseFunc = (expr: Expression) => Expression;
 */

export class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.errors = [];
    this.curToken;
    this.peekToken;
    this.prefixParseFns = new Map();
    this.infixParserFns = new Map();

    this.registerPrefix(TokenType.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(TokenType.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(TokenType.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(TokenType.MINUS, this.parsePrefixExpression.bind(this));

    this.registerInfix(TokenType.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(
      TokenType.ASTERISK,
      this.parseInfixExpression.bind(this),
    );
    this.registerInfix(TokenType.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.GT, this.parseInfixExpression.bind(this));

    this.nextToken();
    this.nextToken();
  }

  errors() {
    return this.errors;
  }

  registerPrefix(tokenType, prefixParseFn) {
    this.prefixParseFns.set(tokenType, prefixParseFn);
  }

  registerInfix(tokenType, infixParseFn) {
    this.infixParserFns.set(tokenType, infixParseFn);
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  curPrecedence() {
    return precedences.get(this.curToken.type) || Precedence.LOWEST;
  }

  peekPrecedence() {
    return precedences.get(this.peekToken.type) || Precedence.LOWEST;
  }

  noPrefixParseFnError(tokenType) {
    const msg = `no prefix parse function for ${tokenType} found.`;
    this.errors.push(msg);
  }

  parseProgram() {
    const program = new Program();
    while (!this.curTokenIs(TokenType.EOF)) {
      const stmt = this.parseStatement();
      if (stmt) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }
    return program;
  }

  parseStatement() {
    switch (this.curToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement() {
    const stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    stmt.name = new Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement() {
    const stmt = new ReturnStatement(this.curToken);
    this.nextToken();

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement() {
    const stmt = new ExpressionStatement(this.curToken);

    stmt.expression = this.parseExpression(Precedence.LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence) {
    const prefix = this.prefixParseFns.get(this.curToken.type);
    if (!prefix) {
      this.noPrefixParseFnError(this.curToken.type);
      return null;
    }

    let leftExp = prefix();

    while (
      !this.peekTokenIs(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParserFns.get(this.peekToken.type);
      if (!infix) {
        return leftExp;
      }

      this.nextToken();

      leftExp = infix(leftExp);
    }

    return leftExp;
  }

  curTokenIs(tokenType) {
    return this.curToken.type === tokenType;
  }

  peekTokenIs(tokenType) {
    return this.peekToken.type === tokenType;
  }

  peekError(tokenType) {
    const msg = `expected next token to be ${tokenType}, got ${this.peekToken.type} instead.`;
    this.errors.push(msg);
  }

  expectPeek(tokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(tokenType);
      return false;
    }
  }

  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  parseIntegerLiteral() {
    if (this.curToken == null) {
      return null;
    }

    const lit = new IntegerLiteral(this.curToken);
    const val = parseInt(this.curToken.literal);

    if (Number.isNaN(val)) {
      const msg = `could not parse ${this.curToken.literal} as integer`;
      this.errors.push(msg);
      return null;
    }
    lit.value = val;
    return lit;
  }

  parsePrefixExpression() {
    const expression = new PrefixExpression(
      this.curToken,
      this.curToken.literal,
    );
    this.nextToken();
    expression.right = this.parseExpression(Precedence.PREFIX);
    return expression;
  }

  parseInfixExpression(left) {
    const expression = new InfixExpression(
      this.curToken,
      this.curToken.literal,
      left,
    );
    const precedence = this.curPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence);
    return expression;
  }
}

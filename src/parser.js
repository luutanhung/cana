import { Identifier, LetStatement, Program, ReturnStatement } from "./ast.js";
import { TokenType } from "./token.js";

export class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.errors = [];
    this.curToken;
    this.peekToken;

    this.nextToken();
    this.nextToken();
  }

  errors() {
    return this.errors;
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
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
        return this.parserReturnStatement();
      default:
        return null;
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

  parserReturnStatement() {
    const stmt = new ReturnStatement(this.curToken);
    this.nextToken();

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
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
}

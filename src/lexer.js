import { createToken, lookupIdent, TokenType } from "./token";

function isLetter(ch) {
  return /^[a-zA-Z_]$/.test(ch);
}

function isDigit(ch) {
  return /^[0-9]$/.test(ch);
}

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = null;
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = null;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  readIdentifier() {
    const startOfIdentifier = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(startOfIdentifier, this.position);
  }

  readNumber() {
    const startOfNumber = this.position;
    while (isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(startOfNumber, this.position);
  }

  skipWhitespace() {
    while (this.ch !== null && /\s/.test(this.ch)) {
      this.readChar();
    }
  }

  nextToken() {
    let tok;

    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        tok = createToken(TokenType.ASSIGN, this.ch);
        break;
      case ";":
        tok = createToken(TokenType.SEMICOLON, this.ch);
        break;
      case "(":
        tok = createToken(TokenType.LPAREN, this.ch);
        break;
      case ")":
        tok = createToken(TokenType.RPAREN, this.ch);
        break;
      case ",":
        tok = createToken(TokenType.COMMA, this.ch);
        break;
      case "+":
        tok = createToken(TokenType.PLUS, this.ch);
        break;
      case "{":
        tok = createToken(TokenType.LBRACE, this.ch);
        break;
      case "}":
        tok = createToken(TokenType.RBRACE, this.ch);
        break;
      case null: // EOF.
        tok = createToken(TokenType.EOF, "");
        break;
      default:
        if (isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const tokenType = lookupIdent(literal);
          tok = createToken(tokenType, literal);
          return tok;
        }
        if (isDigit(this.ch)) {
          const literal = this.readNumber();
          const tokenType = TokenType.INT;
          tok = createToken(tokenType, literal);
          return tok;
        } else {
          tok = createToken(TokenType.ILLEGAL, this.ch);
        }
    }

    this.readChar();
    return tok;
  }
}

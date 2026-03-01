import { createToken, lookupIdent, TokenType } from "./token.js";

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
    this.readChar();
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

  peekChar() {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition];
    }
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
      // Operators.
      case "=":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          tok = createToken(TokenType.EQ, ch + this.ch);
        } else {
          tok = createToken(TokenType.ASSIGN, this.ch);
        }
        break;
      case "+":
        tok = createToken(TokenType.PLUS, this.ch);
        break;
      case "-":
        tok = createToken(TokenType.MINUS, this.ch);
        break;
      case "!":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          tok = createToken(TokenType.NOT_EQ, ch + this.ch);
        } else {
          tok = createToken(TokenType.BANG, this.ch);
        }
        break;
      case "/":
        tok = createToken(TokenType.SLASH, this.ch);
        break;
      case "*":
        tok = createToken(TokenType.ASTERISK, this.ch);
        break;
      case "<":
        tok = createToken(TokenType.LT, this.ch);
        break;
      case ">":
        tok = createToken(TokenType.GT, this.ch);
        break;

      // Delimiters.
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

  getTokenList() {
    const tokens = [];
    let tok;
    while ((tok = this.nextToken())) {
      tokens.push(tok);
    }
    return tokens;
  }
}

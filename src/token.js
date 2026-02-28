export const TokenType = Object.freeze({
  ILLEGAL: "ILLEGAL", // signify an unknown token/character.
  EOF: "EOF", // notify end of file.

  // Identifiers + literals.
  IDENT: "IDENT",
  INT: "INT",

  // Operators.
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",

  LT: "<",
  GT: ">",

  // Delimiters.
  COMMA: ",",
  SEMICOLON: ";",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  // Keywords.
  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",

  EQ: "==",
  NOT_EQ: "!=",
});

const Keywords = Object.freeze({
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
});

export class Token {
  constructor(type, literal) {
    this.type = type;
    this.literal = literal;
  }
}

export function createToken(type, literal) {
  return new Token(type, literal);
}

export function lookupIdent(ident) {
  if (Keywords.hasOwnProperty(ident)) {
    const tokenType = Keywords[ident];
    return tokenType;
  }
  return TokenType.IDENT;
}

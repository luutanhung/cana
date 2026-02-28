export class Node {
  tokenLiteral() {
    throw new Error("tokenLiteral() must be implemented.");
  }
}

export class Statement extends Node {
  statementNode() {
    throw new Error("statementNode() must be implemented");
  }
}

export class Expression extends Node {
  expressionNode() {
    throw new Error("expressionNode() must be implemented");
  }
}

export class LetStatement extends Statement {
  constructor(token, name, expression) {
    super();

    this.token = token;
    this.name = name;
    this.expression = expression;
  }

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
}

export class Identifier extends Expression {
  constructor(token, value) {
    super();

    this.token = token;
    this.value = value;
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
}

export class Program {
  constructor() {
    this.statements = [];
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

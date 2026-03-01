export class Node {
  tokenLiteral() {
    throw new Error("tokenLiteral() must be implemented.");
  }
  string() {
    throw new Error("string() must be implemented.");
  }
}

export class Statement extends Node {
  constructor() {
    super();
  }

  statementNode() {
    throw new Error("statementNode() must be implemented");
  }
}

export class Expression extends Node {
  constructor() {
    super();
  }
  expressionNode() {
    throw new Error("expressionNode() must be implemented");
  }
}

export class LetStatement extends Statement {
  constructor(token, name, expression) {
    super();

    this.token = token;
    this.name = name;
    this.value = expression;
  }

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let out = "";
    out += this.tokenLiteral() + " ";
    out += this.name.string();
    out += " = ";
    if (this.value) {
      out += this.value.string();
    }
    out += ";";
    return out;
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

  string() {
    return this.value;
  }
}

export class ReturnStatement extends Statement {
  constructor(token, returnValue) {
    super();

    this.token = token;
    this.returnValue = returnValue;
  }

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let out = "";
    out += this.tokenLiteral() + " ";
    if (this.returnValue) {
      out += this.returnValue.string();
    }
    out += ";";
    return out;
  }
}

export class ExpressionStatement extends Expression {
  constructor(token, expression) {
    super();

    this.token = token;
    this.expression = expression;
  }

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    if (this.expression) {
      return this.expression.string();
    }
  }
}

export class IntegerLiteral extends Expression {
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
  string() {
    return this.token.literal;
  }
}

export class PrefixExpression extends Expression {
  constructor(token, operator, right) {
    super();

    this.token = token;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let out = "(";
    out += this.operator;
    out += this.right.string();
    out += ")";
    return out;
  }
}

export class InfixExpression extends Expression {
  constructor(token, operator, left, right) {
    super();

    this.token = token;
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let out = "(";
    if (this.left.string) {
      out += this.left.string();
    }

    out += " " + this.operator + " ";

    if (this.right.string) {
      out += this.right.string();
    }

    out += ")";
    return out;
  }
}

export class Boolean extends Expression {
  constructor(token, value) {
    this.token = token;
    this.value = value;
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
  string() {
    return this.token.literal;
  }
}

export class BlockStatement extends Statement {
  constructor(token, statements = []) {
    super();

    this.token = token;
    this.statements = statements;
  }

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let out = "";
    for (let stmt of this.statements) {
      out += stmt.string();
    }
    return out;
  }
}

export class IfExpression extends Expression {
  constructor(token, condition, consequence, alternative) {
    super();

    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    let out = "if ";
    if (this.condition.string) {
      out += this.condition.string();
    }
    out += " ";
    if (this.consequence.string) {
      out += this.consequence.string();
    }
    if (this.alternative.string) {
      out += " else ";
      out += this.alternative.string();
    }
    return out;
  }
}

export class Program extends Node {
  constructor() {
    super();
    this.statements = [];
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }

  string() {}
}

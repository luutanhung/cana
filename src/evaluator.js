import {
  Boolean as AstBoolean,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  Program,
} from "./ast.js";
import {
  BooleanObject,
  IntegerObject,
  NullObject,
  ObjectType,
} from "./object.js";

const TRUE = new BooleanObject(true);
const FALSE = new BooleanObject(false);
const NULL = new NullObject();

export function evaluate(node) {
  if (node instanceof Program) {
    return evalStatements(node.statements);
  }

  if (node instanceof ExpressionStatement) {
    return evaluate(node.expression);
  }

  if (node instanceof IntegerLiteral) {
    return new IntegerObject(node.value);
  }

  if (node instanceof AstBoolean) {
    return nativeBoolToBooleanObject(node.value);
  }

  if (node instanceof PrefixExpression) {
    const right = evaluate(node.right);
    return evalPrefixExpression(node.operator, right);
  }

  return null;
}

function evalStatements(stmts) {
  let result = null;
  for (let stmt of stmts) {
    result = evaluate(stmt);
  }
  return result;
}

function nativeBoolToBooleanObject(input) {
  if (input) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function evalPrefixExpression(operator, right) {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusOperatorExpression(right);
    default:
      return null;
  }
}

function evalBangOperatorExpression(right) {
  let res = FALSE;
  switch (right) {
    case TRUE:
      res = FALSE;
      break;
    case FALSE:
      res = TRUE;
      break;
    case NULL:
      res = TRUE;
      break;
    default:
      res = FALSE;
      break;
  }
  return res;
}

function evalMinusOperatorExpression(right) {
  if (right.type() !== ObjectType.INTEGER_OBJ) {
    return NULL;
  }

  const value = right.value;
  return new IntegerObject(-value);
}

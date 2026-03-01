import { ExpressionStatement, IntegerLiteral, Program } from "./ast.js";
import { Integer } from "./object.js";

export function evaluate(node) {
  if (node instanceof Program) {
    evalStatements(node.statements);
  }

  if (node instanceof ExpressionStatement) {
    return evaluate(node.expression);
  }

  if (node instanceof IntegerLiteral) {
    return new Integer(node.value);
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

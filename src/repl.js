import readline from "readline";
import { Lexer } from "./lexer.js";
import { TokenType } from "./token.js";
import { Parser } from "./parser.js";

const PROMPT = ">> ";

export function start() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: PROMPT,
  });

  rl.prompt();

  rl.on("line", (line) => {
    const lexer = new Lexer(line);
    // console.log(lexer.getTokenList());
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    if (program.statements.length > 0) {
      console.log(program.statements);
      console.log(program.statements[0].string());
    }

    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

start();

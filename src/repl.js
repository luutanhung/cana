import readline from "readline";
import { Lexer } from "./lexer.js";
import { TokenType } from "./token.js";

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
    for (
      let tok = lexer.nextToken();
      tok.type !== TokenType.EOF;
      tok = lexer.nextToken()
    ) {
      console.log(tok);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

start();

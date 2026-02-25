import { describe, test } from "vitest";
import { Lexer } from "../src";

describe("lexer", () => {
  test("returns a list of tokens", () => {
    const input = `
      let five = 5;
      let ten = 10;
      let add = fn(x, y) {
        x + y;
      };
      let result = add(five, ten);
      `;

    const lexer = new Lexer(input);
    console.log(lexer.nextToken());
    console.log(lexer.nextToken());
    console.log(lexer.nextToken());
  });
});

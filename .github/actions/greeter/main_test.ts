import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { greet } from "./main.ts";

describe(greet.name, () => {
  it("greets the name specified", () => {
    const result = greet("Nick");
    expect(result).toBe("Hello Nick!");
  });

  it("handles empty strings", () => {
    const result = greet("");
    expect(result).toBe("Who are you?");
  });
});

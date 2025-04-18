import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { truthyValue } from "../../lib/mod.ts";

describe("bar", () => {
  it("has a passing test", () => {
    expect(truthyValue).toBeTruthy();
  });
});

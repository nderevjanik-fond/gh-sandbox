import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { truthyValue } from "./mod.ts";

describe("lib", () => {
  it("has an exported truthy value that is true", () => {
    expect(truthyValue).toBeTruthy();
  });
});

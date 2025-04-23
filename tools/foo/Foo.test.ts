import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { buggyTruthyValue } from "../../lib/mod.ts";

describe("foo", () => {
  it("has an exported buggy truthy value", () => {
    expect(buggyTruthyValue).toBeTruthy();
  });
});

import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";

describe("baz", () => {
  it.skip("has a skipped test", () => {
    expect(true).toBeTruthy();
  });
});

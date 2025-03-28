import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";

describe("foo", () => {
  it("has a failing test", () => {
    expect(false).toBeTruthy();
  });
});

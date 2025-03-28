import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";

describe("foo", () => {
  it.skip("has a failing test", () => {
    expect(false).toBeTruthy();
  });
});

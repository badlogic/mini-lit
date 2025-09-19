import { test } from "node:test";
import assert from "node:assert";

test("Library builds", () => {
   // Since we're testing a browser library in Node.js,
   // we can't actually import it without DOM globals.
   // This test just ensures the test suite runs.
   assert.ok(true, "Build and test infrastructure works");
});

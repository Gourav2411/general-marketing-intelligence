import assert from "node:assert/strict";
import { completedDateWindow } from "../dist/connectors/google/dates.js";
import { resolveDataMode } from "../dist/connectors/config.js";

assert.equal(resolveDataMode("local",false),"demo");
assert.equal(resolveDataMode("local",true),"local");
console.log("✓ missing optional local CSVs fall back safely instead of crashing MCP startup");

assert.deepEqual(completedDateWindow("2026-08-01","2026-08-28"),{
  startDate:"2026-08-01",
  endDate:"2026-08-28",
  previousStartDate:"2026-07-04",
  previousEndDate:"2026-07-31"
});
console.log("✓ explicit Google report period produces an equal preceding period");

assert.throws(()=>completedDateWindow("2026-02-30","2026-03-01"),/valid calendar date/);
console.log("✓ impossible calendar dates are rejected");

assert.throws(()=>completedDateWindow("2026-03-02","2026-03-01"),/must not be after/);
console.log("✓ reversed date ranges are rejected");

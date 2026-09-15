import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync("scripts/memory.mjs","utf8");
assert.doesNotMatch(source,/console\.(?:log|info|error)\([^\n]*(?:row\.accountId|MARKETING_ACCOUNT_ID|process\.env)/);
assert.doesNotMatch(source,/JSON\.stringify\(readLearningMemory/);
assert.match(source,/Account identifiers and record contents were not logged/);
console.log("✓ legacy memory CLI does not log environment-derived account IDs or learning contents");

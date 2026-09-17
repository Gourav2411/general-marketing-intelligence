import assert from "node:assert/strict";
import {existsSync,mkdtempSync,readFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";

const state=mkdtempSync(join(tmpdir(),"gmi-runtime-state-"));
process.env.GMI_STATE_DIR=state;
delete process.env.MARKETING_TELEMETRY_FILE;
delete process.env.MARKETING_DECISION_DB;
delete process.env.MCP_ACTION_DIR;
process.chdir("/");

const {emitTelemetry}=await import("../dist/observability/telemetry.js");
const {decisionDatabase,closeDecisionDatabase}=await import("../dist/decisions/sqlite.js");
const {history}=await import("../dist/actions/store.js");

emitTelemetry("tool_called",{tool:"connection_status"});
assert.equal(emitTelemetry("tool_called",{tool:"must_not_fail"},"/definitely-unwritable-gmi-state/events.jsonl"),false);
decisionDatabase();
history();
closeDecisionDatabase();

const telemetry=join(state,"telemetry","events.jsonl");
assert.ok(existsSync(telemetry));
assert.match(readFileSync(telemetry,"utf8"),/connection_status/);
assert.ok(existsSync(join(state,"decisions","decisions.sqlite")));
assert.ok(existsSync(join(state,"actions","approvals")));
assert.equal(existsSync("/.marketing-telemetry"),false);
console.log("✓ writable runtime state is independent of the MCP process working directory");

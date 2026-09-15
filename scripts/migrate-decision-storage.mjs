import {existsSync,readFileSync} from "node:fs";
import {resolve} from "node:path";
import {closeDecisionDatabase,insertRecord} from "../dist/decisions/sqlite.js";
const root=resolve(process.env.MARKETING_DECISION_DIR??".marketing-decisions"),read=name=>{const path=resolve(root,`${name}.jsonl`);return existsSync(path)?readFileSync(path,"utf8").split("\n").filter(Boolean).map(JSON.parse):[]};let migrated=0;for(const kind of ["decisions","outcomes","learning"]){for(const row of read(kind)){insertRecord(kind,row);migrated++}}closeDecisionDatabase();console.log(`Migrated or confirmed ${migrated} legacy JSONL records in SQLite. Original JSONL files were preserved.`);

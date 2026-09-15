import Database from "better-sqlite3";
import {mkdirSync} from "node:fs";
import {dirname,join} from "node:path";

const databasePath=()=>process.env.MARKETING_DECISION_DB??join(process.cwd(),".marketing-decisions","decisions.sqlite");
let connection:Database.Database|undefined;
export function decisionDatabase(){
 if(connection)return connection;
 const path=databasePath();mkdirSync(dirname(path),{recursive:true,mode:0o700});
 connection=new Database(path);connection.pragma("journal_mode = WAL");connection.pragma("foreign_keys = ON");connection.pragma("busy_timeout = 5000");
 connection.exec(`CREATE TABLE IF NOT EXISTS decisions (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, account_id TEXT NOT NULL, created_at TEXT NOT NULL, payload TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS decisions_scope ON decisions(tenant_id,account_id,created_at);
CREATE TABLE IF NOT EXISTS outcomes (id TEXT PRIMARY KEY, decision_id TEXT NOT NULL, tenant_id TEXT NOT NULL, account_id TEXT NOT NULL, measured_at TEXT NOT NULL, payload TEXT NOT NULL, FOREIGN KEY(decision_id) REFERENCES decisions(id));
CREATE INDEX IF NOT EXISTS outcomes_scope ON outcomes(tenant_id,account_id,decision_id,measured_at);
CREATE TABLE IF NOT EXISTS learning (id TEXT PRIMARY KEY, decision_id TEXT NOT NULL, tenant_id TEXT NOT NULL, account_id TEXT NOT NULL, created_at TEXT NOT NULL, payload TEXT NOT NULL, FOREIGN KEY(decision_id) REFERENCES decisions(id));
CREATE INDEX IF NOT EXISTS learning_scope ON learning(tenant_id,account_id,created_at);`);
 return connection;
}
export function insertRecord(table:"decisions"|"outcomes"|"learning",row:{id:string;tenantId:string;accountId:string;createdAt?:string;measuredAt?:string;decisionId?:string}){const db=decisionDatabase(),payload=JSON.stringify(row);if(table==="decisions")db.prepare("INSERT OR IGNORE INTO decisions(id,tenant_id,account_id,created_at,payload) VALUES(?,?,?,?,?)").run(row.id,row.tenantId,row.accountId,row.createdAt,payload);else if(table==="outcomes")db.prepare("INSERT OR IGNORE INTO outcomes(id,decision_id,tenant_id,account_id,measured_at,payload) VALUES(?,?,?,?,?,?)").run(row.id,row.decisionId,row.tenantId,row.accountId,row.measuredAt,payload);else db.prepare("INSERT OR IGNORE INTO learning(id,decision_id,tenant_id,account_id,created_at,payload) VALUES(?,?,?,?,?,?)").run(row.id,row.decisionId,row.tenantId,row.accountId,row.createdAt,payload);return row}
export function scopedRecords<T>(table:"decisions"|"outcomes"|"learning",tenantId:string,accountId:string,decisionId?:string):T[]{const db=decisionDatabase();let sql=`SELECT payload FROM ${table} WHERE tenant_id=? AND account_id=?`,args:unknown[]=[tenantId,accountId];if(decisionId){sql+=" AND decision_id=?";args.push(decisionId)}sql+=table==="outcomes"?" ORDER BY measured_at":" ORDER BY created_at";return (db.prepare(sql).all(...args) as {payload:string}[]).map(row=>JSON.parse(row.payload) as T)}
export function closeDecisionDatabase(){connection?.close();connection=undefined}

import {Pool} from "pg";
import type {ClosedLoopLearningRecord,DecisionRecord,OutcomeRecord} from "./types.js";

/** Hosted repository. Every statement carries tenant and account predicates; callers never receive an unscoped query primitive. */
export class PostgresDecisionRepository{
 private pool:Pool;
 constructor(connectionString=process.env.DECISION_DATABASE_URL){if(!connectionString)throw new Error("DECISION_DATABASE_URL is required for Postgres decision storage");this.pool=new Pool({connectionString,max:Number(process.env.DECISION_DB_POOL_SIZE??10),ssl:process.env.DECISION_DB_SSL==="disable"?false:{rejectUnauthorized:true}})}
 async migrate(){await this.pool.query(`CREATE TABLE IF NOT EXISTS marketing_records (kind text NOT NULL, id text PRIMARY KEY, tenant_id text NOT NULL, account_id text NOT NULL, decision_id text, occurred_at timestamptz NOT NULL, payload jsonb NOT NULL); CREATE INDEX IF NOT EXISTS marketing_records_scope ON marketing_records(tenant_id,account_id,kind,occurred_at); CREATE INDEX IF NOT EXISTS marketing_records_decision ON marketing_records(tenant_id,account_id,decision_id);`)}
 async insert(kind:"decision"|"outcome"|"learning",row:DecisionRecord|OutcomeRecord|ClosedLoopLearningRecord){await this.pool.query("INSERT INTO marketing_records(kind,id,tenant_id,account_id,decision_id,occurred_at,payload) VALUES($1,$2,$3,$4,$5,$6,$7)",[kind,row.id,row.tenantId,row.accountId,"decisionId" in row?row.decisionId:null,"createdAt" in row?row.createdAt:row.measuredAt,row])}
 async list<T>(kind:"decision"|"outcome"|"learning",tenantId:string,accountId:string,limit=100){const result=await this.pool.query("SELECT payload FROM marketing_records WHERE kind=$1 AND tenant_id=$2 AND account_id=$3 ORDER BY occurred_at DESC LIMIT $4",[kind,tenantId,accountId,Math.min(1000,Math.max(1,limit))]);return result.rows.map(row=>row.payload as T)}
 async close(){await this.pool.end()}
}

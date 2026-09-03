import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EvidenceBundle } from "./schema.js";
const defaultDir=join(dirname(fileURLToPath(import.meta.url)),"../../data/snapshots");
const snapshotDir=()=>process.env.MARKETING_SNAPSHOT_DIR||defaultDir;
export function saveSnapshot(bundle:EvidenceBundle):string {const dir=snapshotDir();mkdirSync(dir,{recursive:true,mode:0o700});const name=`snapshot-${bundle.generatedAt.replace(/[:.]/g,"-")}.json`,path=join(dir,name);writeFileSync(path,`${JSON.stringify(bundle,null,2)}\n`,{encoding:"utf8",mode:0o600,flag:"wx"});return path}
export function listSnapshots(limit=10):Array<{file:string;generatedAt:string;evidenceCount:number;opportunityCount:number}>{const dir=snapshotDir();try{return readdirSync(dir).filter(name=>/^snapshot-.*\.json$/.test(name)).sort().reverse().slice(0,limit).map(file=>{const bundle=JSON.parse(readFileSync(join(dir,file),"utf8")) as EvidenceBundle;return {file,generatedAt:bundle.generatedAt,evidenceCount:bundle.evidence.length,opportunityCount:bundle.opportunities.length}})}catch{return []}}
export function loadSnapshots(limit=10):EvidenceBundle[]{const dir=snapshotDir();try{return readdirSync(dir).filter(name=>/^snapshot-.*\.json$/.test(name)).sort().reverse().slice(0,limit).map(file=>JSON.parse(readFileSync(join(dir,file),"utf8")) as EvidenceBundle)}catch{return []}}

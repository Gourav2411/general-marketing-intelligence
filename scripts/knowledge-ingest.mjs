import {readFileSync,readdirSync,writeFileSync} from "node:fs";
import {resolve,join} from "node:path";
import {marketingCaseSchema,loadKnowledgeBase} from "../dist/intelligence/knowledge.js";
const args=process.argv.slice(2),validateOnly=args.includes("--validate");
if(validateOnly){const rows=loadKnowledgeBase();console.log(`✓ ${rows.length} provenance-bearing marketing cases validated; ${rows.filter(x=>x.outcome!=="succeeded").length} failed/mixed cases`);process.exit(0)}
const input=args.find(x=>!x.startsWith("--"));
if(!input)throw new Error("Usage: npm run knowledge:ingest -- /absolute/path/case.json [--commit]");
const parsed=marketingCaseSchema.parse(JSON.parse(readFileSync(resolve(input),"utf8")));
const existing=loadKnowledgeBase();if(existing.some(x=>x.id===parsed.id))throw new Error(`Case id already exists: ${parsed.id}`);
console.log(`✓ Valid case ${parsed.id}; outcome=${parsed.outcome}; sources=${parsed.sources.length}`);
if(!args.includes("--commit")){console.log("Dry run only. Re-run with --commit after editorial and licensing review.");process.exit(0)}
const target=join(process.cwd(),"knowledge/cases",`${parsed.id}.json`);writeFileSync(target,`${JSON.stringify(parsed,null,2)}\n`,{flag:"wx"});console.log(`✓ Added ${target}. Source rights and factual claims still require human review.`);

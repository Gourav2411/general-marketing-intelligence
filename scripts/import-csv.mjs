import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { parse } from "csv-parse/sync";

const source=process.argv[2]&&resolve(process.argv[2]);
if(!source){console.error('Usage: npm run import:csv -- "/path/to/folder"');process.exit(1)}
const specs={
 "search-console.csv":{required:["query","landing_page","segment","impressions","clicks","ctr","average_position","current_period","previous_period","commercial_intent"],numeric:["impressions","clicks","ctr","average_position","current_period","previous_period"]},
 "google-ads.csv":{required:["campaign","segment","keyword_or_theme","spend","impressions","clicks","cpc","leads","mqls","sqls","estimated_pipeline","landing_page"],numeric:["spend","impressions","clicks","cpc","leads","mqls","sqls","estimated_pipeline"]},
 "conversions.csv":{required:["source","campaign","landing_page","segment","leads","mqls","sqls","opportunities","estimated_pipeline"],numeric:["leads","mqls","sqls","opportunities","estimated_pipeline"]}
};
const allowedIntent=new Set(["low","medium","high"]),parsed={};
const fail=(file,row,message)=>{throw new Error(`${file} row ${row}: ${message}`)};
for(const [file,spec] of Object.entries(specs)){
 const path=join(source,file);if(!existsSync(path))throw new Error(`Missing required file: ${path}`);
 const rows=parse(readFileSync(path,"utf8"),{columns:true,skip_empty_lines:true,trim:true,bom:true});if(!rows.length)throw new Error(`${file} must contain at least one data row`);
 const headers=Object.keys(rows[0]),missing=spec.required.filter(x=>!headers.includes(x));if(missing.length)throw new Error(`${file} missing columns: ${missing.join(", ")}`);
 rows.forEach((row,index)=>{const line=index+2;for(const column of spec.numeric){const value=row[column];if(value===""||!Number.isFinite(Number(value))||Number(value)<0)fail(file,line,`${column} must be a non-negative number`)}if(!row.segment)fail(file,line,"segment must not be empty");if(file==="search-console.csv"){if(!allowedIntent.has(row.commercial_intent))fail(file,line,"commercial_intent must be low, medium or high");if(Number(row.ctr)>1)fail(file,line,"ctr must be between 0 and 1");if(Number(row.clicks)>Number(row.impressions))fail(file,line,"clicks cannot exceed impressions")}if(file==="google-ads.csv"){if(Number(row.clicks)>Number(row.impressions))fail(file,line,"clicks cannot exceed impressions");if(Number(row.mqls)>Number(row.leads)||Number(row.sqls)>Number(row.mqls))fail(file,line,"funnel counts must satisfy leads ≥ mqls ≥ sqls")}if(file==="conversions.csv"&&(Number(row.mqls)>Number(row.leads)||Number(row.sqls)>Number(row.mqls)||Number(row.opportunities)>Number(row.sqls)))fail(file,line,"funnel counts must satisfy leads ≥ mqls ≥ sqls ≥ opportunities")});
 parsed[file]=rows;console.log(`✓ ${file}: ${rows.length} rows validated`);
}
const adCampaigns=new Set(parsed["google-ads.csv"].map(row=>row.campaign));for(const [index,row] of parsed["conversions.csv"].entries())if(row.source==="Paid Search"&&!adCampaigns.has(row.campaign))fail("conversions.csv",index+2,`Paid Search campaign '${row.campaign}' is missing from google-ads.csv`);
const destination=resolve("data/local");mkdirSync(destination,{recursive:true});for(const file of Object.keys(specs))copyFileSync(join(source,file),join(destination,file));
writeFileSync(join(destination,"import-metadata.json"),JSON.stringify({importedAt:new Date().toISOString(),sourceFolder:basename(source),files:Object.keys(specs)},null,2));
console.log(`\nImported validated files into ${destination}`);console.log("Run with: DATA_MODE=local npm run demo -- growth-bet");

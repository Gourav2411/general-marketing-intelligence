import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import type { AdsRow, ConversionRow, SearchRow } from "../types.js";
import { dataMode } from "../connectors/config.js";

const dataRoot = join(dirname(fileURLToPath(import.meta.url)), "../../data");
const root = dataMode()==="local"?join(dataRoot,"local"):dataRoot;
const numeric = new Set(["impressions","clicks","ctr","average_position","current_period","previous_period","spend","cpc","leads","mqls","sqls","estimated_pipeline","opportunities"]);
function load<T>(file:string):T[] {
  const rows=parse(readFileSync(join(root,file),"utf8"),{columns:true,skip_empty_lines:true,trim:true}) as Record<string,string>[];
  return rows.map(row=>Object.fromEntries(Object.entries(row).map(([key,value])=>[key,numeric.has(key)?Number(value):value]))) as T[];
}
export const data = { search:load<SearchRow>("search-console.csv"), ads:load<AdsRow>("google-ads.csv"), conversions:load<ConversionRow>("conversions.csv") };

import { readFileSync } from "node:fs";
const lock=JSON.parse(readFileSync("package-lock.json","utf8")),allowed=new Set(["Apache-2.0","MIT","ISC","BSD","BSD-2-Clause","BSD-3-Clause","0BSD","CC0-1.0","Python-2.0","BlueOak-1.0.0"]),failures=[];
for(const [path,pkg] of Object.entries(lock.packages??{})){if(!path.startsWith("node_modules/")||pkg.dev)continue;const licenses=String(pkg.license??"").replace(/[()]/g,"").split(/\s+(?:OR|AND)\s+/);if(!licenses.length||licenses.some(value=>!allowed.has(value)))failures.push(`${path}: ${pkg.license??"missing license metadata"}`)}
if(failures.length)throw new Error(`Production dependency license policy failed:\n${failures.join("\n")}`);console.log("Production dependency license policy passed.");

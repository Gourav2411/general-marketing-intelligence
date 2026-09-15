import {appendLearningRecord,readLearningMemory} from "../dist/intelligence/memory.js";
const [command,...args]=process.argv.slice(2),account=process.env.MARKETING_ACCOUNT_ID||"default";
if(command==="list"||!command){const records=readLearningMemory(account).map(({id,createdAt,status})=>({id,createdAt,status}));console.log(JSON.stringify({count:records.length,records},null,2));process.exit(0)}
if(command!=="record")throw new Error("Usage: npm run memory -- list | record '<JSON>'");
const raw=args.join(" ").trim();if(!raw)throw new Error("record requires one JSON object");
const input=JSON.parse(raw);appendLearningRecord(input,account);console.log("✓ Recorded one private learning record. Account identifiers and record contents were not logged.");

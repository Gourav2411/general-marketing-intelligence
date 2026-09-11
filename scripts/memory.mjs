import {appendLearningRecord,readLearningMemory} from "../dist/intelligence/memory.js";
const [command,...args]=process.argv.slice(2),account=process.env.MARKETING_ACCOUNT_ID||"default";
if(command==="list"||!command){console.log(JSON.stringify(readLearningMemory(account),null,2));process.exit(0)}
if(command!=="record")throw new Error("Usage: npm run memory -- list | record '<JSON>'");
const raw=args.join(" ").trim();if(!raw)throw new Error("record requires one JSON object");
const input=JSON.parse(raw);const row=appendLearningRecord(input,account);console.log(`✓ Recorded private learning ${row.id} for account ${row.accountId}; credential contents were not stored.`);

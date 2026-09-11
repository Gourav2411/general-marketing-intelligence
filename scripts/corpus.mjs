import {approveContribution,listContributions,requestChanges,submitContribution} from "../dist/intelligence/review.js";
import {loadKnowledgeBase} from "../dist/intelligence/knowledge.js";
import {corpusStats,renderCorpusStats} from "../dist/intelligence/corpus.js";
import {discoverCandidatePatterns} from "../dist/intelligence/patterns.js";
const [command,...args]=process.argv.slice(2),flag=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:undefined};
if(command==="status"||!command){console.log(renderCorpusStats(corpusStats(loadKnowledgeBase())));process.exit(0)}
if(command==="submit"){const path=args.find(x=>!x.startsWith("--"));if(!path)throw new Error("corpus submit requires an absolute JSON path");const result=submitContribution(path);console.log(`✓ Staged ${result.candidate.id}; possible duplicates=${result.duplicates.length}. No trusted corpus file was changed.`);process.exit(0)}
if(command==="queue"){console.log(JSON.stringify(listContributions().map(x=>({id:x.id,brand:x.brand,campaign:x.campaign,status:x.review.status,rights:x.rights.basis,grade:x.evidenceGrade})),null,2));process.exit(0)}
if(command==="approve"){const id=args.find(x=>!x.startsWith("--")),reviewer=flag("--reviewer"),notes=flag("--notes");if(!id||!reviewer||!notes)throw new Error("corpus approve <id> --reviewer '<name>' --notes '<review>'");const result=approveContribution(id,reviewer,notes);console.log(`✓ Approved ${result.row.id} into ${result.target}`);process.exit(0)}
if(command==="changes"){const id=args.find(x=>!x.startsWith("--")),reviewer=flag("--reviewer"),notes=flag("--notes");if(!id||!reviewer||!notes)throw new Error("corpus changes <id> --reviewer '<name>' --notes '<required changes>'");requestChanges(id,reviewer,notes);console.log(`✓ Changes requested for ${id}`);process.exit(0)}
if(command==="patterns"){console.log(JSON.stringify(discoverCandidatePatterns(loadKnowledgeBase()),null,2));process.exit(0)}
throw new Error("Usage: corpus status|submit|queue|approve|changes|patterns");

import {loadKnowledgeBase} from "../dist/intelligence/knowledge.js";
import {corpusStats,renderCorpusStats} from "../dist/intelligence/corpus.js";
import {caseFingerprint,evidenceGradeIsConsistent} from "../dist/intelligence/ontology.js";
const rows=loadKnowledgeBase(),fingerprints=new Set();for(const row of rows){const fingerprint=caseFingerprint(row);if(fingerprints.has(fingerprint))throw new Error(`Duplicate case fingerprint: ${row.id}`);fingerprints.add(fingerprint);if(!row.rights.redistributionAllowed)throw new Error(`Trusted corpus contains non-redistributable case: ${row.id}`);const grade=evidenceGradeIsConsistent(row);if(!grade.consistent)throw new Error(`${row.id} evidence grade ${grade.declared} exceeds supported ${grade.maximumSupported}`)}
console.log(`✓ ${rows.length} trusted cases validated with ontology v2 canonicalization, rights, grades and duplicate fingerprints`);console.log(renderCorpusStats(corpusStats(rows)));

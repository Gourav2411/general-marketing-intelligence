import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
import type {EvidencePacket} from "./schemas.js";
import {buildIntelligenceContext} from "../intelligence/pipeline.js";
const root=join(dirname(fileURLToPath(import.meta.url)),"../..");
const marketingContext=readFileSync(join(root,"context/marketing.md"),"utf8");
const marketingSkill=readFileSync(join(root,"skills/general-marketing-intelligence/SKILL.md"),"utf8");
export function buildMarketingPrompt(task:string,evidence:EvidencePacket):string{return `${marketingContext}\n\n${marketingSkill}\n\n${buildIntelligenceContext(task,evidence)}\n\n# Evidence packet\n${JSON.stringify(evidence,null,2)}\n\n# Tool-specific task\n${task}\n\nReturn one JSON object with exactly these string fields: observedSignal, interpretation, hypothesis, recommendation, confidence (LOW, MEDIUM, or HIGH), successMetric, reviewWindow, strategicOutput.\n\nRules:\n- CODE is the source of numeric truth. Repeat only figures present in the evidence packet and never alter allocation, ranking, score, state, or calculated metric.\n- Clearly separate observed evidence from interpretation and hypothesis.\n- Challenge weak evidence. Prefer pipeline over traffic.\n- strategicOutput must satisfy the executive output contract in the intelligence protocol.\n- Never invent customer proof, product capabilities, integrations, competitor facts, company results, campaigns or citations. Use [Insert verified evidence] when needed.\n- Historical precedents are analogies, not causal proof; cite only supplied case IDs and URLs.\n- No markdown fences around the JSON.`}

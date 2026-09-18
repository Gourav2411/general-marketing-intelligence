import type {EvidencePacket} from "../ai/schemas.js";
import {loadKnowledgeBase,renderPrecedents,retrievePrecedents} from "./knowledge.js";
import {discoverCandidatePatterns} from "./patterns.js";
export const strategicLenses=["CMO: growth, portfolio allocation and durable advantage","CFO: marginal economics, cash, downside and reversibility","Customer researcher: jobs, motivations, barriers and context","Brand strategist: positioning, distinctiveness and long-term memory","Performance marketer: conversion quality, incrementality and saturation","Creative director: idea, message, craft and wear-out","PR leader: stakeholders, narrative, trust and reputational risk","Measurement scientist: causality, bias, power and testability","Sceptic: disconfirming evidence and failure modes"] as const;
export function buildIntelligenceContext(task:string,evidence:EvidencePacket){
 const cases=loadKnowledgeBase(),precedents=retrievePrecedents(`${task} ${JSON.stringify(evidence.observedFacts)}`,5,cases),patterns=discoverCandidatePatterns(cases).filter(x=>x.confidence==="reviewable"),accountContext=evidence.accountContext as {markdown?:string;provenanceIds?:string[];contradictions?:string[]}|undefined;
 return `# Intelligence protocol

Follow this sequence before answering:
1. Restate the decision, objective, horizon and binding constraints.
2. Establish the measurement baseline and evidence gaps.
3. Diagnose causes; distinguish symptom, mechanism and correlation.
4. Label every material statement FACT, INFERENCE or ASSUMPTION.
5. Compare applicable historical precedents; never copy an execution merely because it is famous.
6. Produce at least two genuinely competing strategies, including do-nothing when rational.
7. Silently review each through every strategic lens below.
8. Red-team the preferred option for failure, cultural, regulatory and reputational risk.
9. Rank options by expected impact, effort, confidence, reversibility and downside.
10. Recommend one decision and explain what would change it.
11. Define an experiment with primary metric, guardrails, review window and stop/continue/scale rules.
12. Require explicit human approval before consequential action.

## Strategic lenses
${strategicLenses.map(x=>`- ${x}`).join("\n")}

## Retrieved precedents
${renderPrecedents(precedents)}

Historical association is not causation. Cite case IDs and source URLs used. Include at least one failed or mixed precedent when available.

## Reviewer-qualified cross-case patterns
${patterns.length?patterns.map(x=>`- ${x.mechanism}: support=${x.supportingCases.join(", ")}; counterexamples=${x.counterexamples.join(", ")}; contexts=${x.contexts.join(", ")}`).join("\n"):"- No pattern meets the minimum multi-case support-and-counterexample gate. Do not manufacture one."}

## Private account learning (outcome-backed and account-scoped)
${accountContext?.markdown??"- No outcome-backed account learning is available. Do not pretend the system has learned this account."}

Learning provenance IDs: ${accountContext?.provenanceIds?.join(", ")||"none"}
Contradictory decision histories: ${accountContext?.contradictions?.join(", ")||"none"}. Preserve contradictions and lower confidence; never average them away.

## Required executive output
Decision; diagnosis; evidence; precedents and transferability; alternatives; recommendation; expected upside/downside; assumptions; confidence; experiment; stop/continue/scale thresholds; human approval required.`;
}

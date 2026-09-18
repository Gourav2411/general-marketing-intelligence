import type {CandidateStrategy} from "../decisions/types.js";
export const evaluatorKinds=["growth_cmo","finance_cfo","customer","brand","performance","creative","pr_reputation","measurement","skeptic"] as const;
export type EvaluatorKind=typeof evaluatorKinds[number];
export interface EvaluationContext {evidence:unknown;constraints:string[];objective:string;accountLearning?:{appliesTo:string[];confidenceChange:number;contradiction?:boolean;id?:string}[];}
export interface StrategyEvaluation {evaluator:EvaluatorKind;preferredOption:string;reasoning:string;expectedUpside:string;downside:string;keyAssumptions:string[];invalidatingEvidence:string[];confidence:"LOW"|"MEDIUM"|"HIGH";riskLevel:"low"|"medium"|"high";objectionsToOtherOptions:{optionId:string;objection:string}[];}
export interface EvaluationSynthesis {evaluations:StrategyEvaluation[];agreements:string[];disagreements:string[];unresolvedTensions:string[];dominantConstraints:string[];finalRecommendation:string;whatWouldChangeRecommendation:string[];}
export interface StrategyEvaluator {kind:EvaluatorKind;evaluate(options:CandidateStrategy[],context:EvaluationContext):StrategyEvaluation;}

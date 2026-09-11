export const toolFamilies={
 executive:["executive_growth_review","channel_health_scorecard","recommend_next_growth_bet","weekly_growth_brief"],
 acquisition:["google_ads_strategy_review","ad_strategy_review","paid_media_diagnostics","google_ads_report","paid_media_csv_report","keyword_opportunity_research"],
 content:["content_strategy","create_campaign_asset","landing_page_opportunity_report","content_decay_monitor"],
 measurement:["measurement_quality_audit","campaign_to_pipeline_report","google_search_console_report","ga4_acquisition_report","generic_crm_api_report"],
 governance:["connection_status","diagnose_setup","action_permission_status","action_audit_history"],
 visualization:["build_dashboard","build_dashboard_chart"]
} as const;
type Route={family:keyof typeof toolFamilies;tools:string[];reason:string};
const rules:[RegExp,keyof typeof toolFamilies,string[]][]= [
 [/\b(budget|campaign|paid|ads?|roas|cpa|creative|pacing|fatigue|anomal(?:y|ies))\b/i,"acquisition",["google_ads_strategy_review","ad_strategy_review","paid_media_diagnostics"]],
 [/seo|search|keyword|content|landing page|decay/i,"content",["keyword_opportunity_research","landing_page_opportunity_report","content_strategy"]],
 [/pipeline|revenue|crm|attribution|measurement|tracking|quality/i,"measurement",["campaign_to_pipeline_report","measurement_quality_audit"]],
 [/dashboard|chart|graph|visual/i,"visualization",["build_dashboard"]],
 [/permission|approval|credential|connection|setup|doctor|audit log/i,"governance",["connection_status","diagnose_setup","action_permission_status"]]
];
export function routeMarketingQuestion(question:string):Route[]{const routes:Route[]=[];for(const [pattern,family,tools] of rules)if(pattern.test(question))routes.push({family,tools,reason:`Question matched ${family} decision signals.`});if(!routes.length)routes.push({family:"executive",tools:["executive_growth_review","recommend_next_growth_bet"],reason:"Broad business question defaults to an executive evidence review."});return routes}
export function renderRoute(question:string,routes:Route[]){return `# Marketing Intelligence Route\n\n**Question:** ${question}\n\n${routes.map((route,index)=>`${index+1}. **${route.family}** — ${route.tools.map(tool=>`\`${tool}\``).join(" → ")}\n   ${route.reason}`).join("\n")}\n\nThe router selects a bounded evidence workflow; it does not execute external actions. Use the listed tools in order, then separate facts, interpretation, assumptions and recommendations.`}
export function renderIntelligenceRoute(question:string,routes:Route[]){return `${renderRoute(question,routes)}\n\n## Mandatory synthesis protocol\n\n1. Define the decision, objective, horizon and constraints.\n2. Establish baseline evidence and measurement gaps.\n3. Diagnose mechanisms; label FACT, INFERENCE and ASSUMPTION.\n4. Retrieve relevant precedents and test transferability, including a failed or mixed case.\n5. Generate competing strategies and a rational do-nothing option.\n6. Review silently through CMO, CFO, customer, brand, performance, creative, PR, measurement and sceptic lenses.\n7. Red-team cultural, regulatory, reputational and execution failure.\n8. Recommend one choice with upside, downside, confidence and what would change the decision.\n9. Define primary metric, guardrails, review window and stop/continue/scale thresholds.\n10. Require explicit human approval before consequential action.\n\nThe host should synthesize one decision, not concatenate tool outputs. Historical examples are analogies, never causal proof.`}

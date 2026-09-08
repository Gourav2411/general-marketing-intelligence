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

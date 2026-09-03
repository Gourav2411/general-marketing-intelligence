export type Segment = string;
export interface SearchRow { query:string; landing_page:string; segment:Segment; impressions:number; clicks:number; ctr:number; average_position:number; current_period:number; previous_period:number; commercial_intent:"low"|"medium"|"high" }
export interface AdsRow { campaign:string; segment:Segment; keyword_or_theme:string; spend:number; impressions:number; clicks:number; cpc:number; leads:number; mqls:number; sqls:number; estimated_pipeline:number; landing_page:string }
export interface ConversionRow { source:string; campaign:string; landing_page:string; segment:Segment; leads:number; mqls:number; sqls:number; opportunities:number; estimated_pipeline:number }
export interface Opportunity { title:string; segment:Segment; score:number; signal:string; hypothesis:string; implication:string; responses:string[]; experiment:string; metric:string }

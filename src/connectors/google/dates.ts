export interface DateWindow { startDate:string; endDate:string; previousStartDate:string; previousEndDate:string }
const iso=(date:Date)=>date.toISOString().slice(0,10);
const parseDate=(value:string,label:string)=>{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new Error(`${label} must use YYYY-MM-DD`);
 const date=new Date(`${value}T00:00:00Z`);
 if(!Number.isFinite(date.getTime())||iso(date)!==value)throw new Error(`${label} is not a valid calendar date`);
 return date;
};
export function completedDateWindow(startDate?:string,endDate?:string,days=28):DateWindow{
 const end=endDate?parseDate(endDate,"end_date"):new Date(Date.now()-86400000),start=startDate?parseDate(startDate,"start_date"):new Date(end.getTime()-(days-1)*86400000);
 if(start>end)throw new Error("start_date must not be after end_date");
 const duration=end.getTime()-start.getTime()+86400000,previousEnd=new Date(start.getTime()-86400000),previousStart=new Date(previousEnd.getTime()-duration+86400000);
 return {startDate:iso(start),endDate:iso(end),previousStartDate:iso(previousStart),previousEndDate:iso(previousEnd)};
}

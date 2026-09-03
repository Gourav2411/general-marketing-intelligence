export interface DateWindow { startDate:string; endDate:string; previousStartDate:string; previousEndDate:string }
const iso=(date:Date)=>date.toISOString().slice(0,10);
export function completedDateWindow(startDate?:string,endDate?:string,days=28):DateWindow{
 const end=endDate?new Date(`${endDate}T00:00:00Z`):new Date(Date.now()-86400000),start=startDate?new Date(`${startDate}T00:00:00Z`):new Date(end.getTime()-(days-1)*86400000);
 if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||start>end)throw new Error("Invalid date range");
 const duration=end.getTime()-start.getTime()+86400000,previousEnd=new Date(start.getTime()-86400000),previousStart=new Date(previousEnd.getTime()-duration+86400000);
 return {startDate:iso(start),endDate:iso(end),previousStartDate:iso(previousStart),previousEndDate:iso(previousEnd)};
}

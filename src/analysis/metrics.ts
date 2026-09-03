const currency=process.env.CURRENCY_CODE||"USD",locale=process.env.NUMBER_LOCALE||"en-US";
export const money = (n:number) => new Intl.NumberFormat(locale,{style:"currency",currency,maximumFractionDigits:0}).format(Math.round(n));
export const pct = (n:number) => `${(n*100).toFixed(1)}%`;
export const ratio = (a:number,b:number) => b ? a/b : 0;
export const sum = <T>(rows:T[], key:keyof T) => rows.reduce((n,r)=>n+Number(r[key]),0);
export const disclaimer = process.env.DATA_MODE==="local"?"Local CSV data supplied by the operator. Verify source, freshness and definitions before making decisions.":"Synthetic demo data only. No production data was used.";

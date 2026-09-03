export type GoogleErrorKind="AUTHENTICATION"|"PERMISSION"|"NOT_FOUND"|"QUOTA"|"TIMEOUT"|"NETWORK"|"INVALID_REQUEST"|"UNKNOWN";
export class ConnectorError extends Error { constructor(public readonly kind:GoogleErrorKind,message:string,public readonly retryable=false){super(message);this.name="ConnectorError"} }
const statusOf=(error:unknown)=>{const value=error as {code?:number|string;response?:{status?:number};status?:number};return Number(value?.response?.status??value?.status??value?.code)};
export function classifyGoogleError(error:unknown):ConnectorError {
 if(error instanceof ConnectorError)return error;const raw=error instanceof Error?error.message:String(error),status=statusOf(error),message=raw.replace(/\s+/g," ").slice(0,500);
 if(status===401||/invalid_grant|invalid credential|unauthenticated/i.test(message))return new ConnectorError("AUTHENTICATION","Google authentication failed. Verify the credential file and rotate it if necessary.");
 if(status===403||/permission|forbidden|does not have access/i.test(message))return new ConnectorError("PERMISSION","Google denied access. Add the service-account email to the exact GA4 or Search Console property.");
 if(status===404||/not found/i.test(message))return new ConnectorError("NOT_FOUND","The configured Google property was not found. Verify the property identifier.");
 if(status===429||/quota|rate limit|resource exhausted/i.test(message))return new ConnectorError("QUOTA","Google API quota was exceeded. Retry later or reduce the requested range.",true);
 if(/timeout|deadline exceeded/i.test(message))return new ConnectorError("TIMEOUT","The Google API request timed out.",true);
 if(status>=500||/ENOTFOUND|ECONNRESET|UNAVAILABLE|network/i.test(message))return new ConnectorError("NETWORK","Google API is temporarily unavailable or the network request failed.",true);
 if(status===400||/invalid argument|bad request/i.test(message))return new ConnectorError("INVALID_REQUEST",message);
 return new ConnectorError("UNKNOWN",`Google API request failed: ${message}`);
}
export async function withRetry<T>(operation:()=>Promise<T>,options:{attempts?:number;baseDelayMs?:number}={}):Promise<T>{
 const attempts=Math.max(1,options.attempts??3),baseDelayMs=Math.max(0,options.baseDelayMs??250);
 for(let attempt=1;attempt<=attempts;attempt++){try{return await operation()}catch(error){const classified=classifyGoogleError(error);if(!classified.retryable||attempt===attempts)throw classified;await new Promise(resolve=>setTimeout(resolve,baseDelayMs*2**(attempt-1)))}}
 throw new ConnectorError("UNKNOWN","Retry loop ended unexpectedly");
}

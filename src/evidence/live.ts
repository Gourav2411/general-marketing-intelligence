import { ga4AcquisitionReport } from "../connectors/google/ga4.js";
import { searchConsoleReport } from "../connectors/google/searchConsole.js";
import { normalizeGoogleEvidence } from "./normalize.js";
import type { EvidenceBundle } from "./schema.js";
export async function getLiveEvidence(options:{days?:number;rowLimit?:number}={}):Promise<EvidenceBundle>{
 const configuredGsc=Boolean(process.env.GSC_SITE_URL&&process.env.GOOGLE_APPLICATION_CREDENTIALS),configuredGa4=Boolean(process.env.GA4_PROPERTY_ID&&process.env.GOOGLE_APPLICATION_CREDENTIALS);
 const [gscResult,ga4Result]=await Promise.allSettled([configuredGsc?searchConsoleReport({rowLimit:options.rowLimit??250}):Promise.resolve(undefined),configuredGa4?ga4AcquisitionReport({days:options.days??28,rowLimit:options.rowLimit??250}):Promise.resolve(undefined)]);
 const gsc=gscResult.status==="fulfilled"?gscResult.value:undefined,ga4=ga4Result.status==="fulfilled"?ga4Result.value:undefined,bundle=normalizeGoogleEvidence(gsc,ga4);
 if(gscResult.status==="rejected")bundle.warnings.push(`GSC unavailable: ${gscResult.reason instanceof Error?gscResult.reason.message:"Unknown error"}`);if(ga4Result.status==="rejected")bundle.warnings.push(`GA4 unavailable: ${ga4Result.reason instanceof Error?ga4Result.reason.message:"Unknown error"}`);
 return bundle;
}

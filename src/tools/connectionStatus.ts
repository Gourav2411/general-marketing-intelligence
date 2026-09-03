import { DemoProvider } from "../connectors/demo/provider.js";
import { dataMode, liveConnections } from "../connectors/config.js";
import { disclaimer } from "../analysis/metrics.js";
import { getAIStatus } from "../ai/provider.js";
export function connectionStatus():string {
 const mode=dataMode(), demo=new DemoProvider().getConnectionStatus(), live=liveConnections(),ai=getAIStatus();
 return `# General Marketing Intelligence — Connection Status\n\n> ${disclaimer}\n\n## Mode\n\n**${mode.toUpperCase()}**${mode==="live"?" — live API clients are not implemented; analysis remains safely unavailable until adapters are completed.":mode==="local"?" — validated operator-supplied CSV files.":" — synthetic demo files; zero external credentials."}\n\n## AI\n\n**Provider:** ${ai.provider==="none"?"None":"OpenAI"}  \n**Model:** ${ai.model??"Not configured"}  \n**Status:** ${ai.status}  \n${ai.detail}\n\n## Active data sources\n\n${demo.map(x=>`${mode==="demo"||mode==="local"?"✓":"○"} ${x.name} — ${mode==="local"?"LOCAL CSV":mode==="demo"?x.status:"inactive in live mode"}`).join("\n")}\n\n## Live connectors\n\n${live.map(x=>`○ **${x.name}** — ${x.status}\n  ${x.detail}`).join("\n")}\n\nAll future integrations are read-only by default. The system can analyse and recommend; humans approve every external action.`;
}

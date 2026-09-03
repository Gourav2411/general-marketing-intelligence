import { DemoProvider } from "../connectors/demo/provider.js";
import { dataMode, liveConnections } from "../connectors/config.js";
import { disclaimer } from "../analysis/metrics.js";
import { getAIStatus } from "../ai/provider.js";
export function connectionStatus():string {
 const mode=dataMode(), demo=new DemoProvider().getConnectionStatus(), live=liveConnections(),ai=getAIStatus();
 const modeDetail=mode==="local"?"validated operator-supplied CSV files power the cross-channel decision tools.":mode==="live"?"direct API tools are available when configured; CSV-backed cross-channel tools remain on bundled data until live normalization is implemented.":"synthetic CSV examples power the cross-channel decision tools.";
 return `# General Marketing Intelligence — Connection Status\n\n> ${disclaimer}\n\n## Cross-channel data mode\n\n**${mode.toUpperCase()}** — ${modeDetail}\n\n## AI\n\n**Provider:** ${ai.provider==="none"?"None":"OpenAI"}  \n**Model:** ${ai.model??"Not configured"}  \n**Status:** ${ai.status}  \n${ai.detail}\n\n## CSV-backed sources\n\n${demo.map(x=>`✓ ${x.name} — ${mode==="local"?"LOCAL CSV":x.status}`).join("\n")}\n\n## Direct and planned connectors\n\n${live.map(x=>`${x.configured?"✓":"○"} **${x.name}** — ${x.status}\n  ${x.detail}`).join("\n")}\n\nImplemented Google connectors are read-only and queried only when their tools are invoked. The system can analyse and recommend; humans approve every external action.`;
}

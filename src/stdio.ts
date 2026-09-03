#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMarketingServer } from "./index.js";

await createMarketingServer().connect(new StdioServerTransport());

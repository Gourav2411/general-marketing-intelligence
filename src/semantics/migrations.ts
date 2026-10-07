import {parseSemanticConfig,type SemanticConfig} from "./config.js";
import {SEMANTIC_SCHEMA_VERSION} from "./types.js";

type RawConfig=Record<string,unknown>;
type Migration=(input:RawConfig)=>RawConfig;
const migrations:Record<number,Migration>={};

export function migrateSemanticConfig(input:unknown):SemanticConfig{
 if(!input||typeof input!=="object"||Array.isArray(input))throw new Error("Semantic config must be an object");
 let current={...(input as RawConfig)},version=Number(current.version);
 if(!Number.isInteger(version))throw new Error("Semantic config version must be an integer");
 if(version>SEMANTIC_SCHEMA_VERSION)throw new Error(`Semantic config version ${version} is newer than supported version ${SEMANTIC_SCHEMA_VERSION}`);
 while(version<SEMANTIC_SCHEMA_VERSION){const migrate=migrations[version];if(!migrate)throw new Error(`No semantic config migration exists from version ${version}`);current=migrate(current);version=Number(current.version)}
 return parseSemanticConfig(current);
}

export const semanticMigrationPath=Object.freeze({currentVersion:SEMANTIC_SCHEMA_VERSION,supportedInputVersions:[SEMANTIC_SCHEMA_VERSION] as number[]});

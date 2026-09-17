import {homedir} from "node:os";
import {join,resolve} from "node:path";

export function runtimeStateRoot(){
 return resolve(process.env.GMI_STATE_DIR??join(homedir(),".general-marketing-intelligence"));
}

export function runtimeStatePath(...segments:string[]){
 return join(runtimeStateRoot(),...segments);
}

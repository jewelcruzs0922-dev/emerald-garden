import * as nodeModule from "node:module";
import { resolve } from "./loader.mjs";

/**
 * Registers the resolver in `loader.mjs`. `registerHooks` is the current API
 * (Node 22.15+); older runtimes fall back to `register`, which runs the hook on
 * a worker thread but behaves the same here.
 */
if (typeof nodeModule.registerHooks === "function") {
  nodeModule.registerHooks({ resolve });
} else {
  nodeModule.register("./loader.mjs", import.meta.url);
}

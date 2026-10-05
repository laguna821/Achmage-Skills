import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";

// node_modules/kordoc/dist/chunk-DC6CTQTK.js
function disableOrtTelemetry() {
  if (typeof process !== "undefined" && process.env) process.env.ORT_DISABLE_TELEMETRY = "1";
}

export {
  disableOrtTelemetry
};

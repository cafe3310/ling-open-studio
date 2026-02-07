import { ToolDef } from "./index";

export const browser_js_eval: ToolDef = {
  name: "browser_js_eval",
  desc: "Execute JavaScript code in the user's browser environment. Use this for calculations, data processing, or accessing browser APIs. Returns the result of the last expression or console logs.",
  argsDesc: {
    code: "The JavaScript code to execute in the browser environment."
  },
  fn: async (args) => {
    return `JS Eval request for code starting with ${args.code.substring(0, 20)}... accepted.`;
  }
};

export const jsTools = [browser_js_eval];

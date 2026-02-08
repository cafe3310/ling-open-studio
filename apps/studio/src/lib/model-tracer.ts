import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { BaseMessage } from "@langchain/core/messages";

/**
 * Trace data structure for LLM interaction
 */
export interface TraceLog {
  timestamp: string;
  graph?: string;
  node: string;
  modelId: string;
  inputs: any[];
  output: string;
}

/**
 * Wraps a model call to capture and log the raw input/output.
 * This is designed to be easily pluggable into LangGraph nodes.
 */
export async function tracedInvoke(
  model: BaseChatModel,
  messages: BaseMessage[],
  config: { nodeName?: string; modelId?: string; graphInfo?: { graphName: string; nodeName: string } } = {}
): Promise<BaseMessage> {
  const graphName = config.graphInfo?.graphName;
  const nodeName = config.graphInfo?.nodeName || config.nodeName || "unknown_node";
  const modelId = config.modelId || (model as any).model || "unknown_model";
  
  // 1. Capture Inputs
  const serializedInputs = messages.map(m => ({
    role: m._getType(),
    content: m.content,
    ...(m.additional_kwargs && Object.keys(m.additional_kwargs).length > 0 ? { kwargs: m.additional_kwargs } : {})
  }));

  const startTime = Date.now();

  try {
    // 2. Execute the actual call
    const response = await model.invoke(messages);

    // 3. Capture Output
    const fullOutput = response.content.toString();

    // 4. Construct Trace Log
    const traceLog: TraceLog = {
      timestamp: new Date().toISOString(),
      graph: graphName,
      node: nodeName,
      modelId: modelId,
      inputs: serializedInputs,
      output: fullOutput
    };

    // 5. Output to Server Logs
    console.log("\n" + "=".repeat(20) + " [RAW CONTEXT TRACE] " + "=".repeat(20));
    if (graphName) console.log(`[GRAPH]: ${graphName}`);
    console.log(`[NODE]: ${nodeName}`);
    console.log(`[MODEL]: ${modelId}`);
    console.log("[INPUTS]:");
    console.log(JSON.stringify(serializedInputs, null, 2));
    console.log("[OUTPUT]:");
    console.log(fullOutput);
    console.log("=".repeat(61) + "\n");

    return response;
  } catch (error) {
    console.error(`[Trace Error] in ${graphName ? `${graphName}/` : ""}${nodeName}:`, error);
    throw error;
  }
}

import { ChatOpenAI } from "@langchain/openai";

/**
 * Model configuration interface
 */
export interface ModelDefinition {
  displayName: string;
  descText: string;
  api_id: string;
}

/**
 * Global model registry and configuration.
 * This structure allows reuse across different assistants and easy environment switching.
 */
export const MODEL_CONFIG = {
  api_endpoint: process.env.OPENAI_API_BASE || "",
  api_key: process.env.OPENAI_API_KEY || "",
  models: {
    Ling_1T: {
      displayName: "Ling-1T",
      descText: "旗舰级大语言模型，具备最强的推理能力、复杂逻辑处理能力和创意写作水平，适用于最严苛的任务。",
      api_id: process.env.MODEL_ID_LING_1T || "ling-1t",
    },
    Ring_1T: {
      displayName: "Ring-1T",
      descText: "高性能旗舰模型，在保持极强推理能力的同时，优化了吞吐量和响应速度。",
      api_id: process.env.MODEL_ID_RING_1T || "ring-1t",
    },
    Ling_Flash: {
      displayName: "Ling-Flash",
      descText: "极速响应模型，兼顾优秀的理解能力和极低的延迟，是实时交互场景的首选。",
      api_id: process.env.MODEL_ID_LING_FLASH || "ling-flash",
    },
    Ring_Flash: {
      displayName: "Ring-Flash",
      descText: "平衡型速度专家，在 Ling-Flash 的基础上进一步优化了特定任务的执行效率。",
      api_id: process.env.MODEL_ID_RING_FLASH || "ring-flash",
    },
    Ling_Mini: {
      displayName: "Ling-Mini",
      descText: "轻量级效能专家，资源占用极低，适合简单对话、意图识别及快速分类任务。",
      api_id: process.env.MODEL_ID_LING_MINI || "ling-mini",
    },
    Ring_Mini: {
      displayName: "Ring-Mini",
      descText: "极致轻量化模型，专为超高频、超低成本的简单任务流设计。",
      api_id: process.env.MODEL_ID_RING_MINI || "ring-mini",
    },
  } as Record<string, ModelDefinition>
};

/**
 * Factory function to create a model instance based on the configuration.
 */
export function createChatModel(modelKey: keyof typeof MODEL_CONFIG.models, options: any = {}) {
  const definition = MODEL_CONFIG.models[modelKey];
  
  if (!definition) {
    throw new Error(`Model definition for "${modelKey}" not found.`);
  }

  return new ChatOpenAI({
    model: definition.api_id,
    temperature: options.temperature ?? 0.7,
    configuration: {
      apiKey: MODEL_CONFIG.api_key,
      baseURL: MODEL_CONFIG.api_endpoint,
    },
    ...options
  });
}

/**
 * Default model instance for general use.
 */
export const model = createChatModel("Ling_1T", { temperature: 0.7 });

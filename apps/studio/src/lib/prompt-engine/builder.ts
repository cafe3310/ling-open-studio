import { BASIC_CONSTRAINTS, FORMATTING_CONSTRAINTS } from "../prompts/shared";
import { stitchDelimited } from "./stitchers/delimited";
import { stitchJson } from "./stitchers/json";
import { stitchXml } from "./stitchers/xml";

export type ToolParadigm = 'delimited' | 'json' | 'xml';

export interface PromptBuilderOptions {
  basePrompt: string;
  tools?: { name: string, desc: string }[];
  paradigm?: ToolParadigm;
  includeStandardConstraints?: boolean;
}

/**
 * Centralized Prompt Builder.
 * Orchestrates the combination of base prompts, shared constraints, and tool protocols.
 */
export const PromptBuilder = {
  /**
   * Builds a full system prompt.
   */
  build: (options: PromptBuilderOptions): string => {
    const { 
      basePrompt, 
      tools = [], 
      paradigm = 'delimited', 
      includeStandardConstraints = true 
    } = options;

    let finalPrompt = basePrompt;

    // 1. Inject standard constraints if requested
    if (includeStandardConstraints) {
      finalPrompt = [
        finalPrompt,
        BASIC_CONSTRAINTS,
        FORMATTING_CONSTRAINTS
      ].join("\n\n");
    }

    // 2. Stitch tool protocol
    if (tools.length > 0) {
      switch (paradigm) {
        case 'json':
          finalPrompt = stitchJson(finalPrompt, tools);
          break;
        case 'xml':
          finalPrompt = stitchXml(finalPrompt, tools);
          break;
        case 'delimited':
        default:
          finalPrompt = stitchDelimited(finalPrompt, tools);
          break;
      }
    }

    return finalPrompt;
  }
};

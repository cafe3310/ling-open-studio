import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

/**
 * State for the Web Architect assistant.
 */
export const WebGenState = Annotation.Root({
  /**
   * The conversation history.
   */
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),

  /**
   * The current task ID (corresponds to a directory in VFS).
   */
  taskId: Annotation<string | undefined>(),

  /**
   * The original user request (extracted from messages at start).
   */
  user_request: Annotation<string | undefined>(),

  /**
   * Node B output: The expanded product plan.
   */
  product_plan: Annotation<string | undefined>(),

  /**
   * Node A output: The visual design specification.
   */
  visual_spec: Annotation<string | undefined>(),

  /**
   * Selected options (passed from frontend body.config)
   */
  config: Annotation<{
    modelId: string;
    designId?: string;
    techStackId?: string;
  } | undefined>(),

  /**
   * Current status of the generation.
   */
  status: Annotation<'idle' | 'planning' | 'designing' | 'coding' | 'refining' | 'error'>(),
});

export type WebGenState = typeof WebGenState.State;

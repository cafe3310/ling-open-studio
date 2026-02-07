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
   * The requirements extracted from user prompt.
   */
  requirements: Annotation<string | undefined>(),

  /**
   * Current status of the generation.
   */
  status: Annotation<'idle' | 'analyzing' | 'coding' | 'error'>(),
});

export type WebGenState = typeof WebGenState.State;

import { AIMessageChunk } from "@langchain/core/messages";

/**
 * A utility class to split a stream of text containing <think> tags 
 * into structured LangChain message parts that toUIMessageStream can recognize.
 */
export class ReasoningSplitter {
  private isThinking = false;
  private buffer = "";

  /**
   * Processes a chunk of text and returns an array of parts.
   * Handles partial tags across chunks.
   */
  process(text: string): { type: "text" | "reasoning"; content: string }[] {
    this.buffer += text;
    const parts: { type: "text" | "reasoning"; content: string }[] = [];

    const THINK_START = "<think>";
    const THINK_END = "</think>";

    while (this.buffer.length > 0) {
      if (!this.isThinking) {
        const thinkIndex = this.buffer.indexOf(THINK_START);
        if (thinkIndex !== -1) {
          // Found start tag
          if (thinkIndex > 0) {
            parts.push({ type: "text", content: this.buffer.substring(0, thinkIndex) });
          }
          this.isThinking = true;
          this.buffer = this.buffer.substring(thinkIndex + THINK_START.length);
        } else {
          // No start tag, check for partial start tag at the end
          const lastBracket = this.buffer.lastIndexOf("<");
          if (lastBracket !== -1 && THINK_START.startsWith(this.buffer.substring(lastBracket))) {
            // Potential partial tag
            if (lastBracket > 0) {
              parts.push({ type: "text", content: this.buffer.substring(0, lastBracket) });
              this.buffer = this.buffer.substring(lastBracket);
            }
            break; // Stop processing and wait for next chunk
          } else {
            // No partial tag
            parts.push({ type: "text", content: this.buffer });
            this.buffer = "";
          }
        }
      } else {
        const endThinkIndex = this.buffer.indexOf(THINK_END);
        if (endThinkIndex !== -1) {
          // Found end tag
          if (endThinkIndex > 0) {
            parts.push({ type: "reasoning", content: this.buffer.substring(0, endThinkIndex) });
          }
          this.isThinking = false;
          this.buffer = this.buffer.substring(endThinkIndex + THINK_END.length);
        } else {
          // No end tag, check for partial end tag at the end
          const lastBracket = this.buffer.lastIndexOf("<");
          if (lastBracket !== -1 && THINK_END.startsWith(this.buffer.substring(lastBracket))) {
            if (lastBracket > 0) {
              parts.push({ type: "reasoning", content: this.buffer.substring(0, lastBracket) });
              this.buffer = this.buffer.substring(lastBracket);
            }
            break;
          } else {
            parts.push({ type: "reasoning", content: this.buffer });
            this.buffer = "";
          }
        }
      }
    }
    return parts;
  }

  /**
   * Transforms an AsyncIterable of LangGraph events to handle <think> tags.
   */
  async *transform(source: AsyncIterable<any>): AsyncGenerator<any> {
    for await (const chunk of source) {
      // LangGraph format: ["messages", [AIMessageChunk, Metadata]]
      if (Array.isArray(chunk) && chunk[0] === "messages") {
        const [msg, metadata] = chunk[1];
        
        if (msg instanceof AIMessageChunk && typeof msg.content === 'string') {
          const splitParts = this.process(msg.content);
          
          if (splitParts.length === 0) continue;

          // Convert split parts to what toUIMessageStream expects
          const content = splitParts.map(p => {
            if (p.type === "reasoning") {
              // Both formats just in case
              return { type: "reasoning", reasoning: p.content };
            }
            return { type: "text", text: p.content };
          });

          // Create a new chunk that toUIMessageStream will recognize
          const newMsg = new AIMessageChunk({
            ...msg,
            content: content as any,
          });
          
          /**
           * HACK: @assistant-ui/react-langgraph's `toUIMessageStream` specifically looks for 
           * `kwargs.contentBlocks` to render structured message parts (like reasoning/thought).
           * Since AIMessageChunk doesn't officially expose 'kwargs' in its TS definition, 
           * we cast to 'any' here to ensure the UI can properly extract and display the thinking process.
           */
          const msgWithKwargs = newMsg as any;
          msgWithKwargs.kwargs = {
            ...msgWithKwargs.kwargs,
            contentBlocks: content
          };

          yield ["messages", [newMsg, metadata]];
        } else {
          yield chunk;
        }
      } else {
        yield chunk;
      }
    }
  }
}

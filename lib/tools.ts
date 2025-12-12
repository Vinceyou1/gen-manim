import { tool } from "ai";
import z from "zod";
import { renderManimVideo } from "./manim";

export const generateVideoTool = tool({
  description: "Generates a video using Manim (Python) code.",
  inputSchema: z.object({
    code: z
      .string()
      .describe(
        'The complete, runnable Manim Python code. Class name must be "GenScene".'
      ),
  }),
  execute: async ({ code }: { code: string }) => {
    const videoUrl = await renderManimVideo(code);
    return { videoUrl };
  },
});

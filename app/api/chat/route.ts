import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { generateVideoTool } from "@/lib/tools";

export const maxDuration = 300; // Allow longer timeout for rendering

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    const modelMessages = convertToModelMessages(messages);
    const languageModel = google(model.id);

    const result = streamText({
      model: languageModel,
      providerOptions: {
        google: {
          thinkingConfig: {
            includeThoughts: true,
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
      messages: modelMessages,
      system: `You are an expert educational content creator.
      
      Your goal is to create a mini-lecture based on the user's request.

      If the user provides a video attachment or asks to improve a previous video:
      - This is "Improvement Mode".
      - Pay special attention to visual misalignment, timing issues, or content errors in the provided video.
      - Your goal is to fix these specific issues while maintaining the overall educational value.
      - Explicitly state what you are fixing before generating the new code.
      
      Otherwise, if the user asks you to explain something, use this process:
      1. Plan the content (script and visualization). Use your reasoning capabilities to create a detailed plan.
      2. Call the \`generateVideo\` tool to create the visualization WITH voiceover.
         - You MUST use the 'GenScene' class name.
         - You MUST inherit from 'VoiceoverScene' (from manim_voiceover).
         - You MUST use 'GTTSService' for text-to-speech.
         - Reference: https://docs.manim.community/en/stable/reference.html
         - Use \`Text\` instead of \`Tex\` or \`MathTex\` if LaTeX is not strictly necessary.
      3. Respond to the user with the script.
         - IMPORTANT: When writing LaTeX in your response, you MUST use double dollar signs ($$) for BOTH inline and block math.
         - Example: "The equation is $$x^2$$" (Inline) or "$$ E = mc^2 $$" (Block).
         - DO NOT use single dollar signs ($) for math.
      
      Example Code Structure:
      \`\`\`python
      from manim import *
      from manim_voiceover import VoiceoverScene
      from manim_voiceover.services.gtts import GTTSService

      class GenScene(VoiceoverScene):
          def construct(self):
              self.set_speech_service(GTTSService(lang="en"))

              with self.voiceover(text="This is a circle.") as tracker:
                  self.play(Create(Circle()), run_time=tracker.duration)

              with self.voiceover(text="Let's add one half and one third.") as tracker:
                  equation = MathTex(r"\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}").scale(2)
                  self.play(Write(equation), run_time=tracker.duration)
      \`\`\`
      
      If \`generateVideo\` fails, analyze the error and try to fix the code and call it again.
      `,
      tools: {
        generateVideo: generateVideoTool,
      },
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

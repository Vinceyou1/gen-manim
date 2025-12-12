"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  CodeIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Shimmer } from "./ai-elements/shimmer";
import { UIToolInvocation, Tool } from "ai";
import VideoDisplay from "./VideoDisplay";
import { generateVideoTool } from "@/lib/tools";

interface ManimVideoProps {
  toolInvocation: {
    state: string;
    args?: {
      code: string;
    };
    input?: unknown;
    output?: {
      videoUrl: string | null;
    };
    errorText?: string;
  };
}

export function ManimVideo({ toolInvocation }: ManimVideoProps) {
  const { state, args, output } = toolInvocation;
  const [isOpen, setIsOpen] = useState(false);

  // @ts-ignore
  const code = args?.code || (toolInvocation as any).input?.code || "";

  // Determine status and data based on tool invocation state
  const isGenerating = state !== "output-available" && state !== "output-error";
  const isError = state === "output-error";

  const errorText =
    toolInvocation.errorText || "An error occurred during generation";
  const videoUrl = output?.videoUrl;

  return (
    <div className="w-full my-4 border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2 text-sm font-medium">
            {isGenerating ? (
              <>
                <Loader2Icon className="size-4 animate-spin text-blue-500" />
                <Shimmer className="w-32">Generating video...</Shimmer>
              </>
            ) : isError ? (
              <>
                <AlertCircleIcon className="size-4 text-red-500" />
                <span className="text-red-500">Generation Failed</span>
              </>
            ) : (
              <>
                <CodeIcon className="size-4 text-green-500" />
                <span>Video Generated</span>
              </>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <span>{isOpen ? "Hide Code" : "Show Code"}</span>
              <ChevronDownIcon
                className={cn(
                  "size-4 transition-transform",
                  isOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="p-4 bg-muted/30 overflow-x-auto">
            <pre className="text-xs font-mono text-muted-foreground">
              {code}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="p-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <Loader2Icon className="relative size-8 animate-spin text-blue-500" />
            </div>
            <p className="text-sm">Rendering animation...</p>
          </div>
        ) : isError ? (
          <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
            <Collapsible>
              <CollapsibleTrigger className="group flex items-center gap-2 font-semibold hover:underline cursor-pointer w-full text-left">
                <AlertCircleIcon className="size-4" />
                <span>Generation Failed (Click for details)</span>
                <ChevronDownIcon className="size-4 ml-auto transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <pre className="whitespace-pre-wrap text-xs font-mono bg-red-500/5 p-2 rounded border border-red-500/10 overflow-x-auto">
                  {errorText}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : videoUrl ? (
          // TODO: Add audioUrl
          <VideoDisplay videoUrl={videoUrl} />
        ) : (
          // Fallback if success but no video URL (shouldn't happen ideally)
          <div className="text-sm text-muted-foreground">
            No video URL returned.
          </div>
        )}
      </div>
    </div>
  );
}

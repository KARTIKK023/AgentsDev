"use client";

import * as React from "react";
import { X, Brain, FileCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatArtifactProps {
  className?: string;
}

type TabType = "thinking" | "evaluation";

const thinkingSteps = [
  "Analyzing the user's question",
  "Searching through relevant context",
  "Identifying key concepts and requirements",
  "Formulating a comprehensive response",
  "Reviewing and refining the answer",
];

const evaluationData = [
  { label: "Relevance", score: 95, description: "Response addresses the query well" },
  { label: "Accuracy", score: 92, description: "Information is correct and reliable" },
  { label: "Coherence", score: 98, description: "Well-structured and logical" },
  { label: "Completeness", score: 90, description: "Covers all aspects of the question" },
];

export function ChatArtifact({ className }: ChatArtifactProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>("thinking");

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (isCollapsed) {
    return (
      <div
        className={cn(
          "flex h-full w-[52px] flex-col border-l border-border bg-background",
          className
        )}
      >
        <div className="flex h-12 items-center justify-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapsed}
            className="size-7"
            aria-label="Expand panel"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 px-1 pt-2">
          <Button
            variant={activeTab === "thinking" ? "secondary" : "ghost"}
            size="icon-sm"
            className="size-8"
            onClick={() => {
              setActiveTab("thinking");
              setIsCollapsed(false);
            }}
            aria-label="Thinking process"
          >
            <Brain className="size-4" />
          </Button>
          <Button
            variant={activeTab === "evaluation" ? "secondary" : "ghost"}
            size="icon-sm"
            className="size-8"
            onClick={() => {
              setActiveTab("evaluation");
              setIsCollapsed(false);
            }}
            aria-label="Evaluation quality"
          >
            <FileCheck className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-[320px] flex-col border-l border-border bg-background",
        className
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-1">
          <Button
            variant={activeTab === "thinking" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 gap-1.5 px-2"
            onClick={() => setActiveTab("thinking")}
          >
            <Brain className="size-3.5" />
            Thinking
          </Button>
          <Button
            variant={activeTab === "evaluation" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 gap-1.5 px-2"
            onClick={() => setActiveTab("evaluation")}
          >
            <FileCheck className="size-3.5" />
            Evaluation
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleCollapsed}
          className="size-7"
          aria-label="Collapse panel"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === "thinking" && (
          <div className="flex flex-col gap-2 p-3">
            {thinkingSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg border border-border/60 p-2.5"
              >
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                  {index + 1}
                </div>
                <p className="text-xs leading-relaxed text-foreground">{step}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "evaluation" && (
          <div className="flex flex-col gap-2 p-3">
            {evaluationData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-1.5 rounded-lg border border-border/60 p-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.score}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
            <div className="mt-1 rounded-lg border border-border/60 bg-muted/30 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Overall Quality</span>
                <span className="text-xs font-medium">93.75%</span>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ChatArtifact;

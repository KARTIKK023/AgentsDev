
"use client";

import * as React from "react";
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";

import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ChatMessage {
  _id?: string;
  conversationId: string;
  role?: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
  onEdit?: (message: ChatMessage) => void;
  onRetry?: (message: ChatMessage) => void;
  onFeedback?: (
    messageId: string,
    feedback: "like" | "dislike" | null
  ) => void;
}

export function ChatMessages({
  messages,
  isStreaming = false,
  onEdit,
  onRetry,
  onFeedback,
}: ChatMessagesProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const [feedback, setFeedback] = React.useState<
    Record<string, "like" | "dislike" | null>
  >({});

  React.useEffect(() => {
    if (!copiedId) return;

    const timeout = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timeout);
  }, [copiedId]);

  const handleCopy = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.conversationId);
    } catch (error) {
      console.error("Unable to copy message:", error);
    }
  };

  const handleFeedback = (
    messageId: string,
    value: "like" | "dislike"
  ) => {
    const nextValue =
      feedback[messageId] === value ? null : value;

    setFeedback((current) => ({
      ...current,
      [messageId]: nextValue,
    }));

    onFeedback?.(messageId, nextValue);
  };

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const isLastMessage = index === messages.length - 1;

          return (
            <Message
              key={message._id ?? `${message.role}-${index}`}
              align={isUser ? "end" : "start"}
            >
              <MessageContent className="min-w-0 max-w-full gap-2">

                {isUser ? (
                  <Bubble align="end" variant="muted">
                    <BubbleContent className="whitespace-pre-wrap break-words">
                      {message.content}
                    </BubbleContent>
                  </Bubble>
                ) : (
                  <div className="w-full min-w-0">
                    <Streamdown>
                      {message.content}
                    </Streamdown>

                    {isStreaming && isLastMessage && (
                      <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current align-middle" />
                    )}
                  </div>
                )}

                {/* Message actions */}
                {(!isStreaming || !isLastMessage) && (
                  <MessageFooter
                    className={
                      isUser
                        ? "justify-end"
                        : "justify-start px-0"
                    }
                  >
                    {isUser ? (
                      <>
                        <MessageAction
                          label="Copy message"
                          onClick={() => handleCopy(message)}
                        >
                          {copiedId === message.conversationId ? (
                            <CheckIcon />
                          ) : (
                            <CopyIcon />
                          )}
                        </MessageAction>

                        <MessageAction
                          label="Edit message"
                          onClick={() => onEdit?.(message)}
                          disabled={!onEdit}
                        >
                          <PencilIcon />
                        </MessageAction>
                      </>
                    ) : (
                      <>
                        <MessageAction
                          label="Copy response"
                          onClick={() => handleCopy(message)}
                        >
                          {copiedId === message.conversationId ? (
                            <CheckIcon />
                          ) : (
                            <CopyIcon />
                          )}
                        </MessageAction>

                        <MessageAction
                          label="Good response"
                          aria-pressed={feedback[message.conversationId] === "like"}
                          onClick={() =>
                            handleFeedback(message.conversationId, "like")
                          }
                        >
                          <ThumbsUpIcon
                            className={
                              feedback[message.conversationId] === "like"
                                ? "fill-current"
                                : undefined
                            }
                          />
                        </MessageAction>

                        <MessageAction
                          label="Bad response"
                          aria-pressed={feedback[message.conversationId] === "dislike"}
                          onClick={() =>
                            handleFeedback(message.conversationId, "dislike")
                          }
                        >
                          <ThumbsDownIcon
                            className={
                              feedback[message.conversationId] === "dislike"
                                ? "fill-current"
                                : undefined
                            }
                          />
                        </MessageAction>

                        <MessageAction
                          label="Regenerate response"
                          onClick={() => onRetry?.(message)}
                          disabled={!onRetry}
                        >
                          <RefreshCcwIcon />
                        </MessageAction>
                      </>
                    )}
                  </MessageFooter>
                )}
              </MessageContent>
            </Message>
          );
        })}
      </div>
    </ScrollArea>
  );
}

interface MessageActionProps
  extends React.ComponentProps<typeof Button> {
  label: string;
}

function MessageAction({
  label,
  children,
  type = "button",
  ...props
}: MessageActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type={type}
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            {...props}
          >
            {children}
          </Button>
        }
      />
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

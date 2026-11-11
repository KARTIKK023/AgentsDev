
"use client";

import * as React from "react";
import {
  ArrowUpIcon,
  ChevronDownIcon,
  FileTextIcon,
  PlusIcon,
  XIcon,
  SquareIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import type { RootState } from "@/redux/store";
import sendMessage from "@/features/message/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "@/features/message/getMessages";
import { setMessages } from "@/redux/messageSlice";


type AttachmentFile = {
  id: string;
  file: File;
};

const providers = [
  {
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 mini" },
    ],
  },
  {
    name: "Anthropic",
    models: [
      { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
    ],
  },
];

const models = providers.flatMap((provider) => provider.models);

const efforts = [
  { id: "low", name: "Low" },
  { id: "medium", name: "Medium" },
  { id: "high", name: "High" },
];

interface ChatInputProps {
  isGenerating?: boolean;
  onStop?: () => void;
}

export function ChatInput({
  isGenerating = false,
  onStop,
}: ChatInputProps) {
  const [text, setText] = React.useState("");
  const [files, setFiles] = React.useState<AttachmentFile[]>([]);
  const [model, setModel] = React.useState(models[0].id);
  const [effort, setEffort] = React.useState("medium");

  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const currentModel =
    models.find((item) => item.id === model) ?? models[0];

  const currentEffort =
    efforts.find((item) => item.id === effort) ?? efforts[1];

  const canSend =
    (text.trim().length > 0 || files.length > 0) && !isGenerating;

  const { selectedConversation } = useSelector((state: RootState) => state.conversations);
  

const dispatch = useDispatch();

const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!canSend || !selectedConversation) return;

  const payload = {
    prompt: text.trim(),
    conversationId: selectedConversation._id,
  };

  try {
    await sendMessage(payload);

    setText("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const data = await getMessages(selectedConversation._id);
    dispatch(setMessages(data));
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

  function onAttach(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;

    if (!selected) return;

    setFiles((current) => [
      ...current,
      ...Array.from(selected, (file) => ({
        id: crypto.randomUUID(),
        file,
      })),
    ]);

    event.target.value = "";
  }

  function removeFile(id: string) {
    setFiles((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  return (
    <>
      <Separator />

      <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
        <form ref={formRef} onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={onAttach}
          />

          <InputGroup>

            {/* Attachments */}
            {files.length > 0 && (
              <InputGroupAddon
                align="block-start"
                className="flex-wrap gap-2"
              >
                {files.map((item) => (
                  <Attachment key={item.id} size="sm">
                    <AttachmentMedia>
                      <FileTextIcon />
                    </AttachmentMedia>

                    <AttachmentContent>
                      <AttachmentTitle>
                        {item.file.name}
                      </AttachmentTitle>
                    </AttachmentContent>

                    <AttachmentActions>
                      <AttachmentAction
                        aria-label={`Remove ${item.file.name}`}
                        onClick={() => removeFile(item.id)}
                      >
                        <XIcon />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                ))}
              </InputGroupAddon>
            )}

            {/* Textarea */}
            <InputGroupTextarea
              ref={textareaRef}
              value={text}
              disabled={isGenerating}
              onChange={(event) => setText(event.target.value)}
              placeholder={
                isGenerating
                  ? "Agent is responding..."
                  : "Ask the agent to change your code..."
              }
              rows={1}
              className="max-h-52 min-h-12 resize-none p-3"
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
            />

            {/* Bottom controls */}
            <InputGroupAddon
              align="block-end"
              className="flex-wrap"
            >
              {/* Attach */}
              <InputGroupButton
                type="button"
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Attach files"
                disabled={isGenerating}
                onClick={() => inputRef.current?.click()}
              >
                <PlusIcon />
              </InputGroupButton>

              {/* Model selector */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <InputGroupButton
                      type="button"
                      size="sm"
                      variant="outline"
                      aria-label={`Model: ${currentModel.name}`}
                      className="ml-auto"
                      disabled={isGenerating}
                    >
                      {currentModel.name}
                      <ChevronDownIcon />
                    </InputGroupButton>
                  }
                />

                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuRadioGroup
                    value={model}
                    onValueChange={setModel}
                  >
                    {providers.map((provider, index) => (
                      <React.Fragment key={provider.name}>
                        {index > 0 && <DropdownMenuSeparator />}

                        <DropdownMenuGroup>
                          <DropdownMenuLabel>
                            {provider.name}
                          </DropdownMenuLabel>

                          {provider.models.map((item) => (
                            <DropdownMenuRadioItem
                              key={item.id}
                              value={item.id}
                              closeOnClick
                            >
                              {item.name}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuGroup>
                      </React.Fragment>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Effort selector */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <InputGroupButton
                      type="button"
                      size="sm"
                      variant="outline"
                      aria-label={`Effort: ${currentEffort.name}`}
                      disabled={isGenerating}
                    >
                      <span className="text-muted-foreground">
                        Effort
                      </span>
                      {currentEffort.name}
                      <ChevronDownIcon />
                    </InputGroupButton>
                  }
                />

                <DropdownMenuContent align="start" className="w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      Effort
                    </DropdownMenuLabel>

                    <DropdownMenuRadioGroup
                      value={effort}
                      onValueChange={setEffort}
                    >
                      {efforts.map((item) => (
                        <DropdownMenuRadioItem
                          key={item.id}
                          value={item.id}
                          closeOnClick
                        >
                          {item.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Send / Stop */}
              {isGenerating ? (
                <InputGroupButton
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  className="rounded-full"
                  aria-label="Stop generating"
                  onClick={onStop}
                  disabled={!onStop}
                >
                  <SquareIcon className="size-3 fill-current" />
                </InputGroupButton>
              ) : (
                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  variant="default"
                  className="rounded-full"
                  disabled={!canSend}
                  aria-label="Send message"
                >
                  <ArrowUpIcon />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </>
  );
}

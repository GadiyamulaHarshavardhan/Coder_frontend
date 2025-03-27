"use client";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "./EmojiPicker";
import SendIcon from "./SendIcon";
import { UploadIcon } from "./UploadIcon";
import EmojiIcon from "./EmojiIcon";

interface InputBoxProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
}

export default function InputBox({ onSendMessage, onFileUpload }: InputBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize container position
  useEffect(() => {
    if (containerRef.current && !hasInteracted) {
      containerRef.current.style.bottom = "50%";
      containerRef.current.style.transform = "translate(-50%, 50%)";
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Enable scroll only when exceeding 5 lines
      const lineCount = inputValue.split('\n').length;
      textareaRef.current.style.overflowY = lineCount > 5 ? "auto" : "hidden";
    }
  }, [inputValue]);

  const handleInteraction = () => {
    if (!hasInteracted && containerRef.current) {
      setHasInteracted(true);
      containerRef.current.style.transition = "all 0.5s ease-out";
      containerRef.current.style.bottom = "1rem";
      containerRef.current.style.transform = "translate(-50%, 0)";
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
      // Reset textarea height after send
      if (textareaRef.current) {
        textareaRef.current.style.height = "44px";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    focusTextarea();
  };

  const focusTextarea = () => {
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = ""; // Reset file input
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
    handleInteraction();
  };

  return (
    <div
      ref={containerRef}
      className="fixed left-1/2 w-[95%] sm:w-[90%] max-w-[700px] flex flex-col gap-2 z-[1000]"
      style={{ transition: "all 0.5s ease-out" }}
    >
      <div className="flex flex-col bg-background rounded-2xl border border-border shadow-lg">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleInteraction();
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleInteraction}
          className="flex-1 p-3 sm:p-4 pb-2 bg-background text-foreground placeholder:text-muted-foreground
                   rounded-t-2xl outline-none resize-none overflow-y-auto
                   min-h-[44px] max-h-[200px]
                   border-none focus:border-none focus:ring-0 
                   scrollbar-thin scrollbar-thumb-border scrollbar-track-background/50
                   transition-[height] duration-200 ease-in-out text-sm sm:text-base"
          placeholder="Message.."
          rows={1}
          style={{ height: "44px" }}
        />

        <div className="flex items-center justify-between p-2 sm:px-4 rounded-b-2xl bg-background">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  focusTextarea();
                  handleInteraction();
                }}
                className="focus:outline-none"
                aria-label="Toggle emoji picker"
              >
                <EmojiIcon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 hover:text-foreground transition-colors" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-10 left-0 z-[1000]">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            <button
              onClick={handleFileButtonClick}
              className="focus:outline-none"
              aria-label="Upload file"
            >
              <UploadIcon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 hover:text-foreground transition-colors" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="focus:outline-none disabled:opacity-50"
            aria-label="Send message"
          >
            <SendIcon
            onClick={() => {
              handleSend();
              handleInteraction();
            }}
            disabled={!inputValue.trim()}
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              !inputValue.trim()
                ? "text-muted-foreground"
                : "text-foreground/80 hover:text-foreground"
            } transition-colors`}
          />
          </button>
        </div>
      </div>
    </div>
  );
}

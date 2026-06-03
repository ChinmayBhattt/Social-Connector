'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from './Icon';

type ChatBarProps = {
  onSend: (prompt: string) => void;
  onHistoryToggle: () => void;
  onTemplatesToggle: () => void;
  isStreaming: boolean;
};

export default function ChatBar({
  onSend,
  onHistoryToggle,
  onTemplatesToggle,
  isStreaming,
}: ChatBarProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition on client-mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  }, [isListening]);

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  }, []);

  const removeAttachedFile = useCallback(() => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if ((!input.trim() && !attachedFile) || isStreaming) return;
      
      let finalPrompt = input.trim();
      if (attachedFile) {
        finalPrompt = `${finalPrompt} [Attached File: ${attachedFile.name}]`.trim();
      }

      onSend(finalPrompt);
      setInput('');
      setAttachedFile(null);
    },
    [input, attachedFile, isStreaming, onSend]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  /** Public method to focus the input */
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Expose via ref if needed — but also use callback ref pattern
  React.useEffect(() => {
    // Re-export focusInput via a global for the parent to call
    (window as unknown as Record<string, unknown>).__Connector_focus_chat = focusInput;
    return () => {
      delete (window as unknown as Record<string, unknown>).__Connector_focus_chat;
    };
  }, [focusInput]);

  return (
    <div
      id="chat-bar"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-8 w-full max-w-2xl px-4
                 max-md:mb-4 max-md:max-w-full max-md:px-3"
    >
      <form
        onSubmit={handleSubmit}
        className="glass rounded-full shadow-[0_0_20px_rgba(173,198,255,0.15)] flex items-center gap-2 px-6 py-2 w-full
                   focus-within:shadow-[0_0_30px_rgba(173,198,255,0.25)] transition-shadow duration-300"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Voice Input (Mic) button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 transition-all active:scale-95 duration-100 shrink-0 relative ${
            isListening
              ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          title={isListening ? 'Stop Listening' : 'Voice Search'}
          aria-label={isListening ? 'Stop Listening' : 'Voice Search'}
        >
          <Icon name="mic" filled={isListening} />
          {isListening && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        {/* File Attach Button */}
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-2 text-on-surface-variant hover:text-primary transition-all active:scale-95 duration-100 shrink-0"
          title="Attach File"
          aria-label="Attach File"
        >
          <Icon name="attach_file" />
        </button>

        {/* File Preview Chip */}
        {attachedFile && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-on-surface animate-fade-in max-w-[180px] shrink-0">
            <Icon name="insert_drive_file" size={14} className="text-primary animate-pulse" />
            <span className="truncate max-w-[100px] font-medium">{attachedFile.name}</span>
            <button
              type="button"
              onClick={removeAttachedFile}
              className="p-0.5 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-on-surface transition-all shrink-0 flex items-center justify-center"
              aria-label="Remove File"
            >
              <Icon name="close" size={12} />
            </button>
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-on-surface font-body text-[16px] placeholder:text-on-surface-variant/40 py-2 min-w-0"
          placeholder="Ask AI anything..."
          disabled={isStreaming}
          id="chat-input"
        />

        {/* Quick actions (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-4 shrink-0">
          <button
            type="button"
            onClick={onHistoryToggle}
            className="text-on-surface-variant hover:bg-white/5 rounded-full p-2 transition-all active:scale-95"
            title="History"
            aria-label="History"
          >
            <Icon name="history" />
          </button>
          <button
            type="button"
            onClick={onTemplatesToggle}
            className="text-on-surface-variant hover:bg-white/5 rounded-full p-2 transition-all active:scale-95"
            title="Templates"
            aria-label="Templates"
          >
            <Icon name="layers" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="bg-primary text-on-primary rounded-full p-2 w-10 h-10 flex items-center justify-center
                     hover:opacity-90 active:scale-95 transition-all shadow-lg shrink-0
                     disabled:opacity-40 disabled:cursor-not-allowed"
          title="Send"
          aria-label="Send message"
          id="send-btn"
        >
          <Icon name="arrow_forward" filled />
        </button>
      </form>
    </div>
  );
}

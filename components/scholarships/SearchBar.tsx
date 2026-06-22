"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const syncedValue = useRef(value);

  useEffect(() => {
    if (value !== syncedValue.current) {
      setInputValue(value);
      syncedValue.current = value;
    }
  }, [value]);

  useEffect(() => {
    if (inputValue === syncedValue.current) return;
    const timer = setTimeout(() => {
      onChange(inputValue);
      syncedValue.current = inputValue;
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, onChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute top-1/2 left-3 z-10 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search scholarships by name, provider, or keyword..."
        className="h-10 w-full rounded-xl border-0 bg-muted/40 pl-10 pr-10 text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors placeholder:text-gray-400 focus-visible:bg-background focus-visible:shadow-[0_0_0_2px_rgba(5,150,105,0.15)] dark:bg-gray-800/50"
        aria-label="Search scholarships"
      />
      {inputValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setInputValue("");
            syncedValue.current = "";
            onChange("");
          }}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

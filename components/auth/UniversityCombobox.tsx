"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface University {
  value: string;
  label: string;
  abbreviation?: string;
}

const UNIVERSITIES: University[] = [
  { value: "NUST", label: "National University of Sciences and Technology", abbreviation: "NUST" },
  { value: "LUMS", label: "Lahore University of Management Sciences", abbreviation: "LUMS" },
  { value: "FAST-NUCES", label: "FAST-NUCES", abbreviation: "FAST" },
  { value: "GIKI", label: "Ghulam Ishaq Khan Institute", abbreviation: "GIKI" },
  { value: "UET Lahore", label: "University of Engineering and Technology, Lahore", abbreviation: "UET" },
  { value: "UET Peshawar", label: "University of Engineering and Technology, Peshawar", abbreviation: "UET" },
  { value: "Punjab University", label: "University of the Punjab", abbreviation: "PU" },
  { value: "University of Karachi", label: "University of Karachi", abbreviation: "UoK" },
  { value: "IBA Karachi", label: "Institute of Business Administration, Karachi", abbreviation: "IBA" },
  { value: "NED University", label: "NED University of Engineering and Technology", abbreviation: "NED" },
  { value: "COMSATS University", label: "COMSATS University Islamabad", abbreviation: "CUI" },
  { value: "Air University", label: "Air University", abbreviation: "AU" },
  { value: "Bahria University", label: "Bahria University", abbreviation: "BU" },
  { value: "Superior University", label: "Superior University", abbreviation: "SU" },
  { value: "Virtual University", label: "Virtual University of Pakistan", abbreviation: "VU" },
  { value: "Quaid-i-Azam University", label: "Quaid-i-Azam University", abbreviation: "QAU" },
  { value: "University of Peshawar", label: "University of Peshawar", abbreviation: "UoP" },
  { value: "Mehran University", label: "Mehran University of Engineering and Technology", abbreviation: "MUET" },
  { value: "Other", label: "Other (please specify)" },
];

interface UniversityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  id?: string;
}

export function UniversityCombobox({ value, onChange, invalid, id }: UniversityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => UNIVERSITIES.find((u) => u.value === value),
    [value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UNIVERSITIES;
    return UNIVERSITIES.filter(
      (u) =>
        u.label.toLowerCase().includes(q) ||
        u.value.toLowerCase().includes(q) ||
        (u.abbreviation?.toLowerCase().includes(q) ?? false)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
        )}
      >
        <span className={cn("flex items-center gap-2 truncate", !selected && "text-muted-foreground")}>
          {selected ? (
            <>
              <span className="truncate">{selected.value}</span>
              {selected.abbreviation && selected.value !== selected.abbreviation && (
                <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
                  {selected.abbreviation}
                </span>
              )}
            </>
          ) : (
            "Search your university..."
          )}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="relative border-b border-border p-2">
            <Search className="absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="h-8 border-0 bg-transparent pl-7 text-sm shadow-none focus-visible:ring-0"
              aria-label="Search universities"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>
            ) : (
              filtered.map((u) => {
                const isSelected = u.value === value;
                return (
                  <li key={u.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(u.value);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Check
                          className={cn(
                            "size-4 shrink-0 text-primary",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{u.label}</span>
                      </span>
                      {u.abbreviation && (
                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {u.abbreviation}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

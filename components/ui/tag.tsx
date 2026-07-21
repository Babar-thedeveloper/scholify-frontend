import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        muted: "bg-muted text-foreground",
        primary: "bg-emerald-50 text-primary dark:bg-emerald-500/10",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
)

interface TagProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof tagVariants> {
  /** When provided, renders a ✕ button that calls this on click. */
  onRemove?: () => void
  /** Accessible label for the remove button, e.g. `Remove ${skill}`. */
  removeLabel?: string
}

function Tag({
  className,
  variant,
  children,
  onRemove,
  removeLabel,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ variant }), className)}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? "Remove"}
          className="ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}

export { Tag, tagVariants }

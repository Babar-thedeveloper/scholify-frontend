import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const spinnerSizes = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const

interface SpinnerProps extends React.ComponentProps<typeof Loader2> {
  size?: keyof typeof spinnerSizes
}

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <Loader2
      data-slot="spinner"
      className={cn("animate-spin text-muted-foreground", spinnerSizes[size], className)}
      {...props}
    />
  )
}

export { Spinner, spinnerSizes }

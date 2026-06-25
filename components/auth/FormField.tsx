import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  helper?: React.ReactNode;
  helperVariant?: "muted" | "warning";
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  error,
  helper,
  helperVariant = "muted",
  children,
  className,
}: FormFieldProps) {
  const helperClass =
    helperVariant === "warning"
      ? "text-amber-600 dark:text-amber-400"
      : "text-muted-foreground";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-xs font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : helper ? (
        <p className={`text-xs ${helperClass}`}>{helper}</p>
      ) : null}
    </div>
  );
}

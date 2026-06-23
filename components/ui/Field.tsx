import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function Wrap({
  label,
  hint,
  required,
  error,
  fieldId,
  children,
}: {
  label?: string;
  hint?: string;
  required?: boolean;
  error?: string;
  fieldId: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={fieldId} className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate">
          {label} {required && <span className="text-burgundy">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span id={`${fieldId}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
          <AlertCircle size={12} /> {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-slate-soft">{hint}</span>
      )}
    </label>
  );
}

const fieldBase =
  "w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-[15px] text-slate placeholder:text-slate-soft/60 transition-colors focus:outline-none focus:ring-2";
const fieldOk = "border-slate/20 focus:border-burgundy focus:ring-burgundy/15";
const fieldErr = "border-danger focus:border-danger focus:ring-danger/15";

type InputProps = { label?: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, required, error, className, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Wrap label={label} hint={hint} required={required} error={error} fieldId={fieldId}>
      <input
        ref={ref}
        id={fieldId}
        className={cn(fieldBase, error ? fieldErr : fieldOk, className)}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
    </Wrap>
  );
});

type TextareaProps = { label?: string; hint?: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, required, error, className, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Wrap label={label} hint={hint} required={required} error={error} fieldId={fieldId}>
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(fieldBase, "resize-none", error ? fieldErr : fieldOk, className)}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
    </Wrap>
  );
});

type SelectProps = { label?: string; hint?: string; error?: string } & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, required, error, className, children, id, ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Wrap label={label} hint={hint} required={required} error={error} fieldId={fieldId}>
      <select
        ref={ref}
        id={fieldId}
        className={cn(fieldBase, "appearance-none bg-no-repeat", error ? fieldErr : fieldOk, className)}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      >
        {children}
      </select>
    </Wrap>
  );
});

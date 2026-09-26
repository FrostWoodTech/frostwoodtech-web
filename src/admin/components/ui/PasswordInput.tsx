import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

type PasswordInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  "type"
>;

/** Password `Input` with a show/hide toggle; use it for every password field (native reveal icons are hidden). */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className = "", ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className={`pr-10 ${className}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);

export default PasswordInput;

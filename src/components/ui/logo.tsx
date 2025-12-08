import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  iconOnly?: boolean;
}

export const Logo = ({ className, iconOnly = false, ...props }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
          <path d="M12 2v2" className="opacity-0" />{/* Spacer */}
        </svg>
        <div className="absolute inset-0 bg-primary/20 blur-[6px] rounded-lg opacity-50" />
      </div>
      {!iconOnly && (
        <span className="font-bold text-xl tracking-tight">Taskflow</span>
      )}
    </div>
  );
};
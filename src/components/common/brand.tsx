import { cn } from "@/utils/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width={32} height={32} rx={9} fill="#5750F1" />
      <circle cx={16} cy={16} r="7.25" stroke="#fff" strokeWidth="1.6" />
      <ellipse
        cx="16"
        cy="16"
        rx="3.1"
        ry="7.25"
        stroke="#fff"
        strokeWidth="1.4"
      />
      <path d="M8.9 13.6H23.1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8.9 18.4H23.1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BrandWithText({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="text-lg font-semibold tracking-tight text-text-primary">
        NetOps Portal
      </span>
    </span>
  );
}

export const BrandWithTextDark = BrandWithText;

import type { ReactNode } from "react";

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 px-2 lg:px-6">
      <div>
        <h1 className="mb-1 text-[28px] leading-8 font-medium text-text-primary">
          {title}
        </h1>
        <p className="text-sm leading-5 text-text-tertiary">{description}</p>
      </div>
      {action}
    </div>
  );
}

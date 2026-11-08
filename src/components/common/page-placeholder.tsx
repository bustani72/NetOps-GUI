export default function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 space-y-5">
      <div className="px-2 lg:px-6">
        <h1 className="mb-1 text-[28px] leading-8 font-medium text-text-primary">
          {title}
        </h1>
        <p className="text-sm leading-5 text-text-tertiary">{description}</p>
      </div>

      <div className="px-2 lg:px-5">
        <div className="rounded-xl border-[0.5px] border-card-border bg-card-surface-area p-8 text-center">
          <p className="text-sm text-text-tertiary">
            Halaman ini sedang dalam pengembangan.
          </p>
        </div>
      </div>
    </div>
  );
}

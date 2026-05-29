interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-10 sm:mb-12 animate-slide-up">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">{title}</h1>
      {description && (
        <p className="text-themed-muted max-w-lg mx-auto">{description}</p>
      )}
    </div>
  );
}

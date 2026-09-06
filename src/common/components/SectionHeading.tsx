import React from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  action
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      
      <div className={centered ? 'max-w-4xl mx-auto' : 'max-w-3xl'}>
        <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-teal-700 ring-1 ring-teal-200">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          {title}
        </h2>
        {description &&
        <p className="mt-4 text-base sm:text-lg lg:text-xl leading-relaxed text-ink-soft">{description}</p>
        }
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}
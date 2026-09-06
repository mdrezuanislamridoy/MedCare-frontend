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
      
      <div className={centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'}>
        <span className="inline-flex items-center rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700 ring-1 ring-teal-200">
          {eyebrow}
        </span>
        <h2 className="mt-3.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink leading-tight">
          {title}
        </h2>
        {description &&
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-soft">{description}</p>
        }
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}
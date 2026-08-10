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
      
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-600 ring-1 ring-teal-100">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {description &&
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{description}</p>
        }
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}
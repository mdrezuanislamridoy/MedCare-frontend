import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, MinusIcon } from 'lucide-react';
import { faqs } from '../data/faqs';
import { SectionHeading } from './SectionHeading';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions patients ask us most"
          description="Still unsure about something? Our support team is available 24/7." />
        

        <div className="mt-12 divide-y divide-teal-100 overflow-hidden rounded-3xl border border-teal-100/80 bg-canvas">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500">
                    
                    <span className="font-display text-base font-semibold text-ink">
                      {faq.question}
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 ring-1 ring-teal-100">
                      {isOpen ?
                      <MinusIcon className="h-4 w-4" aria-hidden="true" /> :

                      <PlusIcon className="h-4 w-4" aria-hidden="true" />
                      }
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen &&
                  <motion.div
                    id={`faq-panel-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden">
                    
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </div>
      </div>
    </section>);

}
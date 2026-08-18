"use client";

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, MinusIcon, SearchIcon, HelpCircleIcon } from 'lucide-react';
import { faqs } from '../data/faqs';
import { SectionHeading } from './SectionHeading';

const categories = ['All', 'Booking', 'Telehealth', 'Payment', 'Records'];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);

      let matchesCat = true;
      if (selectedCategory === 'Booking') {
        matchesCat = faq.question.includes('book') || faq.question.includes('reschedule');
      } else if (selectedCategory === 'Telehealth') {
        matchesCat = faq.question.includes('online') || faq.answer.includes('video');
      } else if (selectedCategory === 'Payment') {
        matchesCat = faq.question.includes('payment') || faq.answer.includes('fee');
      } else if (selectedCategory === 'Records') {
        matchesCat = faq.question.includes('prescriptions') || faq.answer.includes('records');
      }

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section id="faq" className="bg-white py-20 lg:py-24 scroll-mt-12">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions patients ask us most"
          description="Still unsure about something? Search our knowledge base or contact our 24/7 care team."
        />

        {/* Live Search and Category Filter */}
        <div className="mt-8 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full rounded-2xl border border-teal-100 bg-canvas py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'border border-teal-100 bg-canvas text-ink-soft hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 divide-y divide-teal-100 overflow-hidden rounded-3xl border border-teal-100/80 bg-canvas">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
                    >
                      <span className="font-display text-base font-semibold text-ink">
                        {faq.question}
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 ring-1 ring-teal-100">
                        {isOpen ? (
                          <MinusIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <PlusIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden bg-white/60"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <HelpCircleIcon className="mx-auto h-8 w-8 text-teal-400 mb-2" />
              <p className="text-sm font-semibold text-ink">No questions found</p>
              <p className="text-xs text-ink-muted mt-1">
                Try searching for different keywords or clear your search query.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
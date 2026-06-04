import React, { useState } from 'react';

export function AccordionItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="font-medium text-gray-800">{question}</span>
        <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && (
        <div className="pb-4 text-gray-600 leading-relaxed text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Accordion({ items = [] }) {
  return (
    <div className="divide-y divide-gray-200">
      {items.map((it, i) => (
        <AccordionItem key={i} question={it.question} answer={it.answer} />
      ))}
    </div>
  );
}

import { useState } from 'react'
import { faq } from '../config/content'

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 focus:outline-none group"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm sm:text-base transition-colors duration-150 ${open ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>
          {question}
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-gray-400 transform transition-transform duration-200 ${open ? 'rotate-180 text-indigo-500' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-gray-500 text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="pb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{faq.sectionTitle}</h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">{faq.sectionSubtitle}</p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 px-6">
          {faq.items.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

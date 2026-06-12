import React, { useState } from "react"
import { FiChevronDown, FiHelpCircle } from "react-icons/fi"

const faqData = [
  {
    question: "Are Well Clean Solutions products safe for children and pets?",
    answer: "Yes, absolutely. All of our formulations utilize non-toxic, family-safe, and biodegradable ingredients. They are free from toxic chlorine bleach fumes and harsh acid corrosives, making them ideal and safe for households with kids and pets.",
  },
  {
    question: "How long does shipping and delivery take?",
    answer: "We offer reliable nationwide delivery. Standard shipping typically takes between 2 to 5 business days depending on your location. Once your order is processed, you will receive real-time tracking updates.",
  },
  {
    question: "Do you offer bulk quantities for corporate businesses or distributors?",
    answer: "Yes, we do. We offer custom bulk configurations (such as 5 Litre concentrates) and commercial wholesale rates for offices, educational institutions, distributors, and cleaning companies. Please fill out our contact enquiry form below to receive a custom quote.",
  },
  {
    question: "What makes your products eco-friendly?",
    answer: "Our cleaning agents are formulated with plant-based active surfactants instead of harsh petrochemicals. They dissolve safely into the ecosystem without damaging water systems. Furthermore, we use recyclable plastic packaging to minimize environment footprints.",
  },
  {
    question: "How can I purchase Well Clean Solutions products online?",
    answer: "Currently, our website is running in Catalog mode. You can browse our full catalog and easily send an inquiry via WhatsApp or submit the quote form below. Direct secure online payment checkouts will be made available shortly.",
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggleFAQ = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 bg-slate-50 font-sans border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Got Questions? We Have Answers
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Learn more about our formulations, delivery options, and business terms.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <span className="flex items-center gap-3 font-bold text-slate-800 text-sm sm:text-base">
                    <FiHelpCircle className="text-brand-blue text-lg flex-shrink-0" />
                    {item.question}
                  </span>
                  <FiChevronDown
                    className={`text-slate-400 text-lg transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-brand-blue" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content Panels */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[250px] border-t border-slate-50" : "max-h-0"
                  }`}
                >
                  <div className="p-6 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed bg-slate-50/20">
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

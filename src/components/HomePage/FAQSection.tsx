'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does the AI Cover Letter Generator work?',
    answer:
      'Our AI Cover Letter Generator uses advanced artificial intelligence to analyze your job description and personal information, then creates a personalized, professional cover letter tailored to your specific role and company. Simply input your details, choose a template, and let our AI generate a compelling cover letter in minutes.',
  },
  {
    question: 'Is the AI Cover Letter Generator free to use?',
    answer:
      'Yes, we offer a free tier that allows you to generate cover letters with basic features. Premium plans provide additional templates, advanced customization options, unlimited generations, and PDF exports. Check our pricing page for detailed information about our plans.',
  },
  {
    question: 'Are the cover letters ATS-friendly?',
    answer:
      'Absolutely! All our cover letter templates are designed to be ATS (Applicant Tracking System) optimized. This means they use proper formatting, keywords, and structure that ATS systems can easily read and parse, increasing your chances of getting past initial screening.',
  },
  {
    question: 'Can I customize the generated cover letter?',
    answer:
      'Yes, you can edit and customize every aspect of your AI-generated cover letter. After generation, you can modify the text, adjust the tone, add or remove sections, and ensure it perfectly matches your voice and the specific job requirements.',
  },
  {
    question: 'How long does it take to generate a cover letter?',
    answer:
      'Our AI Cover Letter Generator typically creates your personalized cover letter in 30-60 seconds. The exact time depends on the complexity of your requirements and the selected template, but most cover letters are ready within a minute.',
  },
  {
    question: 'What information do I need to provide?',
    answer:
      "To generate an effective cover letter, you'll need to provide: the job title, company name, job description or key requirements, your relevant experience and skills, and any specific achievements or qualifications you want to highlight.",
  },
  {
    question: 'Can I download my cover letter as a PDF?',
    answer:
      'Yes, you can download your generated cover letter as a PDF file. Premium users get access to multiple PDF templates and formatting options, while free users can download in standard format.',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      "Yes, we take data security very seriously. All your personal information is encrypted and stored securely. We don't share your data with third parties, and you can delete your account and data at any time. Please see our Privacy Policy for complete details.",
  },
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-on-surface text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-on-surface-variant mt-6 text-lg leading-8">
            Get answers to common questions about our AI Cover Letter Generator. If you have
            additional questions, feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="hover:bg-surface-variant flex w-full items-center justify-between p-6 text-left transition-colors"
                    aria-expanded={openItems.includes(index)}
                  >
                    <h3 className="text-on-surface pr-4 text-lg font-semibold">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      <svg
                        className={`h-6 w-6 transform transition-transform ${
                          openItems.includes(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {openItems.includes(index) && (
                    <div className="border-outline-variant border-t px-6 pb-6">
                      <p className="text-on-surface-variant mt-4 leading-7">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-on-surface-variant text-lg">
            Still have questions?{' '}
            <a
              href="/contact"
              className="text-primary-600 hover:text-primary-700 font-semibold underline"
            >
              Contact our support team
            </a>{' '}
            for personalized assistance.
          </p>
        </div>
      </div>
    </section>
  );
}

'use client'

import { ContactForm } from '@/components/ContactForm'

export function AboutPageClient() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-sumi">
          Get in Touch
        </h2>
        <p className="font-body text-xs text-mist mt-1 tracking-wider">
          お問い合わせ
        </p>
        <div className="w-8 h-px bg-vermillion mx-auto mt-4" />
      </div>
      <ContactForm />
    </div>
  )
}

'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitContactMessage } from '@/lib/contact'
import { softEase, duration } from '@/lib/animations'
import { BrushstrokeUnderline } from './BrushstrokeUnderline'

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const validate = (data: FormState): FormErrors => {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Invalid email address'
  if (!data.message.trim()) errors.message = 'Message is required'
  return errors
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [serverError, setServerError] = useState<string>('')

  const handleChange = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        // Clear error on change
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
      },
    [errors]
  )

  const handleBlur = useCallback(
    (field: keyof FormState) => () => {
      const fieldErrors = validate(form)
      if (fieldErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
      }
    },
    [form]
  )

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      const fieldErrors = validate(form)
      setErrors(fieldErrors)

      if (Object.keys(fieldErrors).length > 0) return

      setStatus('loading')
      setServerError('')

      try {
        const result = await submitContactMessage(form)
        if (result.success) {
          setStatus('success')
        } else {
          setStatus('error')
          setServerError(result.error || 'Something went wrong')
        }
      } catch {
        setStatus('error')
        setServerError('Unable to send message. Please try again.')
      }
    },
    [form]
  )

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        className="max-w-lg mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.reveal, ease: softEase }}
      >
        <motion.div
          className="inline-block border-2 border-vermillion px-6 py-4 rounded-ink-md mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-accent text-3xl text-vermillion">承</span>
        </motion.div>
        <p className="font-body text-sm text-sumi/80">
          受信しました
        </p>
        <p className="font-body text-xs text-mist mt-2">
          Your message has been received. Thank you.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-display text-2xl md:text-3xl text-sumi mb-2 text-center">
        Get in Touch
      </h2>
      <p className="font-body text-xs text-mist text-center mb-8 tracking-wider">
        お問い合わせ
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="contact-name" className="block text-xs text-sumi uppercase tracking-widest mb-2 font-body">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            className={`input w-full ${errors.name ? 'border-vermillion' : ''}`}
            placeholder="Your name"
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-vermillion mt-1 font-body">
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="contact-email" className="block text-xs text-sumi uppercase tracking-widest mb-2 font-body">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            className={`input w-full ${errors.email ? 'border-vermillion' : ''}`}
            placeholder="your@email.com"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-vermillion mt-1 font-body">
              {errors.email}
            </p>
          )}
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="contact-message" className="block text-xs text-sumi uppercase tracking-widest mb-2 font-body">
            Message
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={handleChange('message')}
            onBlur={handleBlur('message')}
            rows={5}
            className={`textarea w-full resize-none ${errors.message ? 'border-vermillion' : ''}`}
            placeholder="Your message..."
            aria-describedby={errors.message ? 'message-error' : undefined}
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-vermillion mt-1 font-body">
              {errors.message}
            </p>
          )}
        </motion.div>

        {/* Server error */}
        <AnimatePresence>
          {status === 'error' && serverError && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-vermillion font-body"
            >
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <BrushstrokeUnderline>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="border border-vermillion text-vermillion bg-transparent rounded-ink px-6 py-2 text-sm uppercase tracking-widest transition-all duration-fast disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-vermillion rounded-full animate-pulse" />
                  <span>Sending</span>
                </span>
              ) : (
                'Send — 送る'
              )}
            </button>
          </BrushstrokeUnderline>
        </motion.div>
      </form>
    </motion.div>
  )
}

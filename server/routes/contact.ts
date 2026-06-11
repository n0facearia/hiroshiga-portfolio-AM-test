import { Router } from 'express'
import db from '../db'

const router = Router()

// POST /api/contact — submit a contact form message
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body as {
      name?: string
      email?: string
      message?: string
    }

    // Validate required fields
    const errors: string[] = []

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name is required')
    }

    if (
      !email ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.push('A valid email address is required')
    }

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      errors.push('Message is required')
    }

    if (errors.length > 0) {
      res.status(400).json({ success: false, error: errors.join('; ') })
      return
    }

    const safeName = (name as string).trim()
    const safeEmail = (email as string).trim()
    const safeMessage = (message as string).trim()

    const insert = db.prepare(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
    )

    insert.run(safeName, safeEmail, safeMessage)

    res.json({ success: true })
  } catch (err) {
    console.error('Error saving contact message:', err)
    res.status(500).json({ success: false, error: 'Failed to save message' })
  }
})

export default router

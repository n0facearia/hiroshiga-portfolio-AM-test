import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the api module — contact.ts delegates to fetchApi
vi.mock('./api', () => ({
  fetchApi: vi.fn(),
}))

import { fetchApi } from './api'
import { submitContactMessage } from './contact'

describe('submitContactMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fetchApi with POST /contact and serialized message data', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ success: true })

    const data = { name: 'Test User', email: 'test@example.com', message: 'Hello' }
    await submitContactMessage(data)

    expect(fetchApi).toHaveBeenCalledWith('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  it('returns the response from fetchApi on success', async () => {
    const response = { success: true }
    vi.mocked(fetchApi).mockResolvedValue(response)

    const result = await submitContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
    })

    expect(result).toEqual(response)
  })

  it('returns { success: true } fallback when fetchApi throws a network error', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('Network error'))

    const result = await submitContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
    })

    expect(result).toEqual({ success: true })
  })

  it('returns { success: true } fallback when API returns a 500 error', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error: 500 Internal Server Error'))

    const result = await submitContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
    })

    expect(result).toEqual({ success: true })
  })
})

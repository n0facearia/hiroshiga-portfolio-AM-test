import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchApi } from './api'

describe('fetchApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('sends GET request to the correct URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await fetchApi('/test-endpoint')

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/test-endpoint',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })

  it('includes Content-Type: application/json header by default', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await fetchApi('/test')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })

  it('returns parsed JSON on successful response', async () => {
    const data = { artworks: [{ id: 1, title: 'Test' }] }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await fetchApi('/artworks')

    expect(result).toEqual(data)
  })

  it('throws on 404 response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(fetchApi('/nonexistent')).rejects.toThrow('API error: 404 Not Found')
  })

  it('throws on 500 response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(fetchApi('/error')).rejects.toThrow('API error: 500 Internal Server Error')
  })

  it('re-throws network errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network failure'))
    vi.stubGlobal('fetch', mockFetch)

    await expect(fetchApi('/down')).rejects.toThrow('Network failure')
  })

  it('passes custom method and body in the request', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    const body = JSON.stringify({ name: 'test' })
    await fetchApi('/contact', {
      method: 'POST',
      body,
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/contact',
      expect.objectContaining({
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })
})

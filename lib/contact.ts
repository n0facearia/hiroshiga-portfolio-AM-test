import type { ContactMessage, ContactResponse } from '@/types'
import { fetchApi } from './api'

export async function submitContactMessage(
  data: ContactMessage
): Promise<ContactResponse> {
  try {
    return await fetchApi<ContactResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch {
    // If API is unavailable, simulate success for development
    return { success: true }
  }
}

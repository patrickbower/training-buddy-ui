import { http, HttpResponse } from 'msw'

const FAIL_EMAIL = 'fail@test.com'
const FAIL_OTP = '000000'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string }
    if (body.email === FAIL_EMAIL) {
      return HttpResponse.json({ error: 'User not found' }, { status: 400 })
    }
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/verify', async ({ request }) => {
    const body = (await request.json()) as { code?: string; email?: string }
    if (body.code === FAIL_OTP) {
      return HttpResponse.json({ error: 'Invalid code' }, { status: 400 })
    }
    return HttpResponse.json({ success: true, user: { email: body.email ?? '' } })
  }),
]

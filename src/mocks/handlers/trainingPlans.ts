import { http, HttpResponse } from 'msw'
import { seedTrainingPlans } from '../data/trainingPlans'
import type { TrainingPlan, Session } from '@/types/domain'

let plans = [...seedTrainingPlans]

export const trainingPlanHandlers = [
  http.get('/api/training-plans', () => {
    return HttpResponse.json(plans)
  }),

  http.get('/api/training-plans/:id', ({ params }) => {
    const plan = plans.find((p) => p.id === params.id)
    if (!plan) {
      return HttpResponse.json({ error: 'Plan not found', code: 'NOT_FOUND' }, { status: 404 })
    }
    return HttpResponse.json(plan)
  }),

  http.post('/api/training-plans', async ({ request }) => {
    const body = (await request.json()) as { startDate: string; goalId: string; weeksCount: number }
    // Simulate coach generation delay
    const newPlan: TrainingPlan = {
      id: `plan_${crypto.randomUUID()}`,
      athleteId: 'ath_01',
      name: `${String(body.weeksCount)}-Week Training Plan`,
      description: 'AI-generated plan based on your goals and fitness level.',
      startDate: body.startDate,
      endDate: body.startDate, // Simplified for mock
      status: 'active',
      sessions: [],
      createdAt: new Date().toISOString(),
    }
    plans = [...plans, newPlan]
    return HttpResponse.json(newPlan, { status: 201 })
  }),

  http.patch('/api/training-plans/:planId/sessions/:sessionId', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Session>
    let updatedSession: Session | undefined

    plans = plans.map((plan) => {
      if (plan.id !== params.planId) return plan
      return {
        ...plan,
        sessions: plan.sessions.map((session) => {
          if (session.id !== params.sessionId) return session
          updatedSession = { ...session, ...body }
          return updatedSession
        }),
      }
    })

    if (!updatedSession) {
      return HttpResponse.json({ error: 'Session not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    return HttpResponse.json(updatedSession)
  }),
]

import { describe, it, expect } from 'vitest'
import { queryKeys } from './queryKeys'

describe('queryKeys', () => {
  it('returns the correct base key for each domain', () => {
    expect(queryKeys.athlete()).toEqual(['athlete'])
    expect(queryKeys.runs()).toEqual(['runs'])
    expect(queryKeys.run('run_01')).toEqual(['runs', 'run_01'])
    expect(queryKeys.trainingPlans()).toEqual(['training-plans'])
    expect(queryKeys.trainingPlan('plan_01')).toEqual(['training-plans', 'plan_01'])
    expect(queryKeys.conversation()).toEqual(['conversation'])
  })

  it('runs key with params is a prefix extension of the base runs key', () => {
    const base = queryKeys.runs()
    const withParams = queryKeys.runs({ limit: 10, offset: 0 })
    expect(withParams[0]).toBe(base[0])
    expect(withParams).toEqual(['runs', { limit: 10, offset: 0 }])
  })
})

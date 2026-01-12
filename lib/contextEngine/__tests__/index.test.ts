/**
 * Tests for Context Engine
 */

import { processCapture } from '../index'

describe('Context Engine', () => {
  describe('processCapture', () => {
    it('should classify email-related captures correctly', () => {
      const result = processCapture({
        raw_text: 'I need to reply to my boss about the meeting',
        user_id: 'test-user',
      })

      expect(result.category).toBe('job')
      expect(result.next_step).toContain('reply')
      expect(result.minutes).toBeGreaterThanOrEqual(5)
      expect(result.minutes).toBeLessThanOrEqual(60)
    })

    it('should detect "today" deadlines', () => {
      const result = processCapture({
        raw_text: 'Pay the electric bill today',
        user_id: 'test-user',
      })

      expect(result.due_at).not.toBeNull()
      if (result.due_at) {
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        expect(result.due_at.getDate()).toBe(today.getDate())
      }
    })

    it('should detect "tomorrow" deadlines', () => {
      const result = processCapture({
        raw_text: 'Call mom tomorrow',
        user_id: 'test-user',
      })

      expect(result.due_at).not.toBeNull()
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('should apply anti-avoidance for high snooze count', () => {
      const result = processCapture({
        raw_text: 'Finish the report',
        user_id: 'test-user',
        snooze_count: 3,
      })

      expect(result.minutes).toBeLessThanOrEqual(10)
      expect(result.difficulty).toBe('low')
      expect(result.next_step.toLowerCase()).toMatch(/open|find|locate/)
    })

    it('should generate swap options for very high snooze count', () => {
      const result = processCapture({
        raw_text: 'Study for exam',
        user_id: 'test-user',
        snooze_count: 5,
      })

      expect(result.swap_options).toBeDefined()
      expect(result.swap_options?.length).toBe(2)
    })

    it('should respect preferred minutes when close', () => {
      const result = processCapture({
        raw_text: 'Clean the kitchen',
        user_id: 'test-user',
        preferred_minutes: 20,
      })

      // Should be close to preferred (within 5 minutes)
      expect(Math.abs(result.minutes - 20)).toBeLessThanOrEqual(5)
    })

    it('should adjust for low energy mode', () => {
      const result = processCapture({
        raw_text: 'Write the essay',
        user_id: 'test-user',
        energy_mode: 'low',
      })

      expect(result.minutes).toBeLessThanOrEqual(15)
      expect(result.difficulty).not.toBe('high')
    })

    it('should generate valid title', () => {
      const result = processCapture({
        raw_text: 'This is a very long capture that should be truncated to a reasonable title length',
        user_id: 'test-user',
      })

      expect(result.title.length).toBeLessThanOrEqual(50)
      expect(result.title.length).toBeGreaterThan(0)
    })
  })
})

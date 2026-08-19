import type { Member } from '../types/member.types'

export const memberService = {
  add(current: Member[], name: string) {
    return [...current, { id: crypto.randomUUID(), name: name.trim(), active: true, createdAt: new Date().toISOString() }]
  },
  deactivate(current: Member[], memberId: string) {
    return current.map((member) => member.id === memberId ? { ...member, active: false } : member)
  },
}

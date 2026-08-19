import type { Id, ISODate } from '../../../types/common.types'

export type Contribution = {
  id: Id
  memberId: Id
  month: string
  amount: number
  received: boolean
  receivedDate?: ISODate
}

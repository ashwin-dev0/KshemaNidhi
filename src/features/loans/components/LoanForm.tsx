import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { FUND_CONFIG } from '../../../config/fund.config'
import { money } from '../../../utils/currency'
import { today } from '../../../utils/dates'
import { buildLoanSchedule } from '../calculations'
import type { InterestMethod, Loan } from '../types/loan.types'
import type { Member } from '../../members/types/member.types'

export function LoanForm({
  members,
  availableFund,
  onCreate,
}: {
  members: Member[]
  availableFund: number
  onCreate: (loan: Loan) => void
}) {
  const [form, setForm] = useState({
    memberId: '',
    date: today,
    principal: '',
    installments: '',
    method: 'REDUCING' as InterestMethod,
  })

  const selectedMember = members.find(
    (member) => member.id === form.memberId
  )

  function submit(event: FormEvent) {
    event.preventDefault()

    const principal = Number(form.principal)
    const installments = Number(form.installments)

    if (
      !selectedMember ||
      !form.date ||
      principal <= 0 ||
      installments <= 0 ||
      !Number.isInteger(installments)
    ) {
      window.alert(
        'Select a borrower and enter a valid date, principal amount and whole number of installments.'
      )
      return
    }

    if (
      principal > availableFund &&
      !window.confirm(
        `This loan is ${money(
          principal - availableFund
        )} more than the currently available fund. Add it anyway?`
      )
    ) {
      return
    }

    onCreate({
      id: crypto.randomUUID(),

      // Always link loan to an existing member
      memberId: selectedMember.id,

      // Keeping name for existing Loan type/display compatibility
      name: selectedMember.name,

      date: form.date,
      principal,
      installments,
      annualRate: FUND_CONFIG.annualInterestRate,
      method: form.method,

      schedule: buildLoanSchedule(
        form.method,
        principal,
        installments,
        FUND_CONFIG.annualInterestRate,
        form.date
      ),

      createdAt: new Date().toISOString(),
    })

    setForm({
      memberId: '',
      date: today,
      principal: '',
      installments: '',
      method: 'REDUCING',
    })
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Plus size={19} />
          Add a loan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a repayment schedule using the selected interest method.
        </p>
      </div>

      <form
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-1"
        onSubmit={submit}
      >
        {/* Borrower */}
        <label className="md:col-span-2 xl:col-span-1">
          <span className="mb-2 block text-sm font-semibold">
            Borrower
          </span>

          <Select
            value={form.memberId}
            onChange={(e) =>
              setForm({
                ...form,
                memberId: e.target.value,
              })
            }
            required
          >
            <option value="">Select member</option>

            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </label>

        {/* Loan Date */}
        <label>
          <span className="mb-2 block text-sm font-semibold">
            Loan date
          </span>

          <Input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />
        </label>

        {/* Principal */}
        <label>
          <span className="mb-2 block text-sm font-semibold">
            Principal
          </span>

          <Input
            type="number"
            min="1"
            step="0.01"
            value={form.principal}
            onChange={(e) =>
              setForm({
                ...form,
                principal: e.target.value,
              })
            }
            placeholder="100000"
          />
        </label>

        {/* Installments */}
        <label>
          <span className="mb-2 block text-sm font-semibold">
            Installments
          </span>

          <Input
            type="number"
            min="1"
            step="1"
            value={form.installments}
            onChange={(e) =>
              setForm({
                ...form,
                installments: e.target.value,
              })
            }
            placeholder="10"
          />
        </label>

        {/* Interest Method */}
        <label>
          <span className="mb-2 block text-sm font-semibold">
            Interest method
          </span>

          <Select
            value={form.method}
            onChange={(e) =>
              setForm({
                ...form,
                method: e.target.value as InterestMethod,
              })
            }
          >
            <option value="REDUCING">
              Reducing principal
            </option>

            <option value="SIMPLE">
              Simple interest
            </option>
          </Select>
        </label>

        {/* Explanation */}
        <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 md:col-span-2 xl:col-span-1">
          {form.method === 'REDUCING'
            ? 'Principal is returned monthly. Interest is calculated on the reducing balance and settled in month N + 1.'
            : 'Fixed monthly interest is paid during the agreed months. The original principal is returned in month N + 1.'}
        </div>

        <Button
          className="md:col-span-2 xl:col-span-1"
          type="submit"
        >
          <Plus size={17} />
          Create loan schedule
        </Button>
      </form>
    </Card>
  )
}
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, Info } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

type DialogOptions = { title: string; description: string; confirmLabel?: string; danger?: boolean }
type DialogRequest = DialogOptions & { alert: boolean; resolve: (confirmed: boolean) => void }
const DialogContext = createContext<{
  confirm: (options: DialogOptions) => Promise<boolean>
  alert: (options: DialogOptions) => Promise<boolean>
} | null>(null)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogRequest | null>(null)
  const pending = useRef<DialogRequest | null>(null)
  function show(options: DialogOptions, alert: boolean) {
    // Ignore duplicate requests while the current dialog awaits a response.
    if (pending.current) return Promise.resolve(false)
    return new Promise<boolean>(resolve => {
      const request = { ...options, alert, resolve }
      pending.current = request
      setDialog(request)
    })
  }
  function finish(confirmed: boolean) {
    pending.current?.resolve(confirmed)
    pending.current = null
    setDialog(null)
  }
  useEffect(() => () => { pending.current?.resolve(false) }, [])
  return <DialogContext.Provider value={{ confirm: options => show(options, false), alert: options => show(options, true) }}>
    {children}
    <Modal open={!!dialog} title={dialog?.title || ''} description={dialog?.description} onClose={() => finish(false)} icon={
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${dialog?.danger ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {dialog?.danger ? <AlertTriangle size={22} /> : <Info size={22} />}
      </div>
    } footer={<>
      {!dialog?.alert && <Button variant="secondary" onClick={() => finish(false)}>Cancel</Button>}
      {dialog?.danger
        ? <button type="button" onClick={() => finish(true)} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">{dialog.confirmLabel || 'Confirm'}</button>
        : <Button onClick={() => finish(true)}>{dialog?.confirmLabel || (dialog?.alert ? 'Got it' : 'Confirm')}</Button>}
    </>} />
  </DialogContext.Provider>
}

export function useDialog() {
  const dialog = useContext(DialogContext)
  if (!dialog) throw new Error('useDialog must be used within DialogProvider')
  return dialog
}

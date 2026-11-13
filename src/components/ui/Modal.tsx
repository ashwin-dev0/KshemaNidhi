import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Modal({ open, title, description, children, footer, icon, onClose }: { open: boolean; title: string; description?: string; children?: ReactNode; footer?: ReactNode; icon?: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  useEffect(() => {
    const element = dialog.current
    if (!open || !element) return
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open])
  if (!open) return null
  return createPortal(
    <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
      if (event.target !== event.currentTarget) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl backdrop:bg-slate-950/45 backdrop:backdrop-blur-sm sm:p-6">
      <div className="flex items-start gap-4">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1 pt-0.5"><h2 id={titleId} className="text-lg font-bold leading-6 text-slate-950">{title}</h2>{description && <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}</div>
        <button type="button" onClick={onClose} aria-label="Close" className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"><X size={18} className="shrink-0" /></button>
      </div>
      {children && <div className="mt-5">{children}</div>}
      {footer && <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">{footer}</div>}
    </dialog>, document.body,
  )
}

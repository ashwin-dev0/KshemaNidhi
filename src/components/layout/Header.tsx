export function Header({ title, description }: { title: string; description: string }) {
  return <header className="mb-6 flex flex-col gap-2 sm:mb-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600"><img src="/kn-icon.svg" alt="" width={24} height={24} className="h-6 w-6 rounded-md" />KshemaNidhi</p><h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h1><p className="max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">{description}</p></header>
}

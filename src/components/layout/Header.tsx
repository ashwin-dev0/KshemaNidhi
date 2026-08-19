export function Header({ title, description }: { title: string; description: string }) {
  return <header className="mb-6 flex flex-col gap-2 sm:mb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">KshemaNidhi</p><h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h1><p className="max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">{description}</p></header>
}

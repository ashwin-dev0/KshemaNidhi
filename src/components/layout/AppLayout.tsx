import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pt-7 md:px-8 lg:px-10 lg:pb-10 xl:px-12 2xl:px-16">
        <div className="mx-auto w-full max-w-[1500px]"><Outlet /></div>
      </main>
    </div>
    <MobileNav />
  </div>
}

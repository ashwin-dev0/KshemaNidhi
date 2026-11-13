import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { useAuth } from '../features/auth/AuthProvider'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { LoansPage } from '../features/loans/pages/LoansPage'
import { ContributionsPage } from '../features/contributions/pages/ContributionsPage'
import { MembersPage } from '../features/members/pages/MembersPage'

export function AppRouter(){
  return <Routes><Route path="login" element={<LoginPage/>}/><Route element={<RequireSession/>}><Route element={<AppLayout/>}><Route index element={<DashboardPage/>}/><Route path="loans" element={<LoansPage/>}/><Route path="contributions" element={<ContributionsPage/>}/><Route path="members" element={<MembersPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Route></Routes>
}

function RequireSession() {
  const { signedIn, checking } = useAuth()
  const location = useLocation()
  if (checking) return <p role="status" className="p-8 text-center text-slate-500">Checking your session...</p>
  return signedIn ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />
}

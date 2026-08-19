import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { LoansPage } from '../features/loans/pages/LoansPage'
import { ContributionsPage } from '../features/contributions/pages/ContributionsPage'
import { MembersPage } from '../features/members/pages/MembersPage'

export function AppRouter(){
  return <Routes><Route element={<AppLayout/>}><Route index element={<DashboardPage/>}/><Route path="loans" element={<LoansPage/>}/><Route path="contributions" element={<ContributionsPage/>}/><Route path="members" element={<MembersPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>
}

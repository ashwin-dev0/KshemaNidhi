import { RotateCcw } from 'lucide-react'
import { useFundStore } from '../store/fundStore'
import { AppRouter } from './router'

export default function App(){
  const { resetAll }=useFundStore()
  return <><AppRouter/><button type="button" onClick={()=>{if(window.confirm('Delete opening fund, loans, members and contribution records?'))resetAll()}} className="fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm hover:text-rose-600 lg:bottom-5"><RotateCcw size={14}/>Reset data</button></>
}

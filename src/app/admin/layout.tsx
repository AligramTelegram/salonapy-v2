import { Shield } from 'lucide-react'
import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-gray-900 min-h-screen shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Salonapy</p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Süper Admin</p>
            </div>
          </div>
        </div>

        <AdminNav />

        <div className="p-3 border-t border-gray-800">
          <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider text-center">
            IP Kısıtlı Erişim
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center px-4 gap-3 border-b border-gray-800">
        <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">Salonapy</span>
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin</span>
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 lg:overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}

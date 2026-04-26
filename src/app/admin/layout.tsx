import { redirect } from 'next/navigation'
import { Shield, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/admin/giris')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-gray-900 min-h-screen shrink-0">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Hemensalon</p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Süper Admin</p>
            </div>
          </div>
        </div>

        <AdminNav />

        <div className="p-3 border-t border-gray-800 mt-auto">
          <p className="text-[10px] text-gray-500 text-center mb-2 truncate">{user.email}</p>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white transition-colors py-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center px-4 gap-3 border-b border-gray-800">
        <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">Hemensalon</span>
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin</span>
      </div>

      <main className="flex-1 min-w-0 lg:overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}

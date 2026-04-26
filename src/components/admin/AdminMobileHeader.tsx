'use client'

import { useState } from 'react'
import { Shield, Menu, X, LogOut } from 'lucide-react'
import { AdminNav } from './AdminNav'

interface Props {
  email: string
}

export function AdminMobileHeader({ email }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 flex items-center px-4 gap-3 border-b border-gray-800">
        <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-white">
          <Menu className="h-5 w-5" />
        </button>
        <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">Hemensalon</span>
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Admin</span>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 flex flex-col transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Hemensalon</p>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Süper Admin</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div onClick={() => setOpen(false)} className="flex-1 overflow-y-auto">
          <AdminNav />
        </div>

        <div className="p-3 border-t border-gray-800">
          <p className="text-[10px] text-gray-500 text-center mb-2 truncate">{email}</p>
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
      </div>
    </>
  )
}

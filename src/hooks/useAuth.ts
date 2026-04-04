'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // İlk yüklemede mevcut oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Auth değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    // 1. Server-side oturumu kapat
    await fetch('/api/auth/logout', { method: 'POST' })
    // 2. Client-side oturumu kapat
    const supabase = createClient()
    await supabase.auth.signOut()
    // 3. Tam sayfa yenile
    window.location.assign('/')
  }, [])

  return { user, loading, logout, isAuthenticated: !!user }
}

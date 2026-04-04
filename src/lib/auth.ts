import { createClient } from '@/lib/supabase/client'

export async function login(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function registerWithSupabase(email: string, password: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'OWNER' },
    },
  })
  if (error) throw error
  return data
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) throw error
}

export async function getRedirectPath(): Promise<string> {
  const res = await fetch('/api/auth/me')
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Kullanıcı bulunamadı')
  return data.redirectPath
}

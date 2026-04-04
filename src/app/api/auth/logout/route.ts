import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = createClient()
    // signOut() invalidates the server session and clears auth cookies via the SSR client
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/auth/logout]', err)
    return NextResponse.json({ error: 'Çıkış yapılamadı' }, { status: 500 })
  }
}

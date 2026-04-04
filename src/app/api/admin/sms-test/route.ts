import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

const NETGSM_API_URL = 'https://api.netgsm.com.tr/sms/send/get'

const ERROR_CODES: Record<string, string> = {
  '20': 'Hatalı kullanıcı adı veya şifre',
  '30': 'Yetersiz bakiye',
  '40': 'Mesaj başlığı onaysız',
  '50': 'Geçersiz telefon numarası',
  '51': 'Hatalı mesaj içeriği',
  '70': 'Hatalı parametre',
}

// POST /api/admin/sms-test
// Body: { usercode, password, header, phone }
export async function POST(request: NextRequest) {
  try {
    const { usercode, password, header, phone } = await request.json()

    if (!usercode || !password || !phone) {
      return NextResponse.json({ error: 'usercode, password ve phone zorunlu' }, { status: 400 })
    }

    let gsmno = phone.replace(/\D/g, '')
    if (gsmno.startsWith('90')) gsmno = gsmno.slice(2)
    if (gsmno.startsWith('0')) gsmno = gsmno.slice(1)

    const msgheader = header || 'SALONAPY'
    const message = 'Salonapy admin panel test mesajı. Bu mesajı görmezden gelebilirsiniz.'

    const response = await axios.get(NETGSM_API_URL, {
      params: { usercode, password, gsmno, message, msgheader, filter: 0, startdate: '', stopdate: '' },
      timeout: 10000,
    })

    const result = String(response.data).trim()

    if (result.startsWith('00')) {
      const messageId = result.split(' ')[1] ?? ''
      return NextResponse.json({ success: true, messageId })
    }

    const errorCode = result.split(' ')[0]
    return NextResponse.json({
      success: false,
      error: ERROR_CODES[errorCode] ?? `NetGSM Hatası: ${result}`,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

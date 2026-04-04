import axios from 'axios'

const NETGSM_API_URL = 'https://api.netgsm.com.tr/sms/send/get'

interface SendSmsParams {
  phone: string  // 5xxxxxxxxx veya 905xxxxxxxxx
  message: string
}

interface SendSmsResult {
  success: boolean
  messageId?: string
  error?: string
}

const ERROR_CODES: Record<string, string> = {
  '20': 'Hatalı kullanıcı adı veya şifre',
  '30': 'Yetersiz bakiye',
  '40': 'Mesaj başlığı onaysız',
  '50': 'Geçersiz telefon numarası',
  '51': 'Hatalı mesaj içeriği',
  '70': 'Hatalı parametre',
}

/**
 * Normalize phone: strips non-digits, removes leading 90 or 0, returns 10-digit
 */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('90')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

export async function sendSms({ phone, message }: SendSmsParams): Promise<SendSmsResult> {
  const usercode = process.env.NETGSM_USER_CODE
  const password = process.env.NETGSM_PASSWORD
  const msgheader = process.env.NETGSM_HEADER || 'SALONAPY'

  if (!usercode || !password) {
    console.log(`[SMS MOCK] To: ${phone} | ${message}`)
    return { success: true, messageId: `mock-${Date.now()}` }
  }

  const gsmno = normalizePhone(phone)

  try {
    const response = await axios.get(NETGSM_API_URL, {
      params: {
        usercode,
        password,
        gsmno,
        message,
        msgheader,
        filter: 0,
        startdate: '',
        stopdate: '',
      },
      timeout: 10000,
    })

    const result = String(response.data).trim()

    if (result.startsWith('00')) {
      const messageId = result.split(' ')[1] ?? ''
      return { success: true, messageId }
    }

    const errorCode = result.split(' ')[0]
    return {
      success: false,
      error: ERROR_CODES[errorCode] ?? `NetGSM Hatası: ${result}`,
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[NetGSM] SMS gönderme hatası:', msg)
    return { success: false, error: msg }
  }
}

export const isSmsConfigured = !!(
  process.env.NETGSM_USER_CODE && process.env.NETGSM_PASSWORD
)

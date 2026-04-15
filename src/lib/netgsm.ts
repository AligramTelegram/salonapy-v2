// NetGSM SMS API — Klasik GET endpoint (test edildi, çalışıyor)
// Endpoint: https://api.netgsm.com.tr/sms/send/get
// Başarı yanıtı: "00 XXXXXXXX" (XXXXXXXX = mesaj ID)
// Hata yanıtı: "20", "30", "40", "50", "70" vb.

const NETGSM_API_URL = 'https://api.netgsm.com.tr/sms/send/get'

interface SendSmsParams {
  phone: string   // Herhangi format: 05xx, 5xx, 905xx
  message: string
}

interface SendSmsResult {
  success: boolean
  messageId?: string
  error?: string
  raw?: string
}

const ERROR_CODES: Record<string, string> = {
  '20': 'Mesaj gövdesi hatalı',
  '30': 'Geçersiz kullanıcı adı veya şifre',
  '40': 'Mesaj başlığı (header) onaylı değil',
  '50': 'Geçersiz telefon numarası',
  '51': 'Hatalı mesaj içeriği',
  '70': 'Hatalı parametre',
  '80': 'Gönderim sınırı aşıldı',
  '85': '1 dakika içinde aynı numaraya çok istek',
  '100': 'Geçersiz kullanıcı adı veya şifre',
}

/**
 * NetGSM 10 haneli format bekliyor: 5XXXXXXXXX
 */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('90')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits // 5XXXXXXXXX (10 hane)
}

export async function sendSms({ phone, message }: SendSmsParams): Promise<SendSmsResult> {
  const usercode = process.env.NETGSM_USER_CODE
  const password = process.env.NETGSM_PASSWORD
  const msgheader = process.env.NETGSM_HEADER || 'SALONAPY'

  // Env yoksa mock
  if (!usercode || !password) {
    console.log(`[SMS MOCK] To: ${phone} | ${message}`)
    return { success: true, messageId: `mock-${Date.now()}` }
  }

  const gsmno = normalizePhone(phone)

  if (!gsmno || gsmno.length < 10) {
    console.error(`[NetGSM] Geçersiz telefon: "${phone}" → "${gsmno}"`)
    return { success: false, error: 'Geçersiz telefon numarası' }
  }

  const params = new URLSearchParams({
    usercode,
    password,
    gsmno,
    message,
    msgheader,
    dil: 'TR',  // Türkçe karakter desteği (ş, ğ, ü, ö, ç, ı)
  })

  const url = `${NETGSM_API_URL}?${params.toString()}`
  console.log(`[NetGSM] İstek gönderiliyor → ${gsmno}`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })

    const raw = (await response.text()).trim()
    console.log(`[NetGSM] Yanıt: "${raw}"`)

    // Başarı: "00 XXXXXXXX" veya "01 XXXXXXXX"
    if (raw.startsWith('00') || raw.startsWith('01')) {
      const parts = raw.split(' ')
      return { success: true, messageId: parts[1] ?? '', raw }
    }

    const errorCode = raw.split(' ')[0]
    const errorMsg = ERROR_CODES[errorCode] ?? `NetGSM Hatası: ${raw}`
    console.error(`[NetGSM] Hata kodu: ${errorCode} → ${errorMsg}`)
    return { success: false, error: errorMsg, raw }

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[NetGSM] İstek hatası:', msg)
    return { success: false, error: msg }
  }
}

export const isSmsConfigured = !!(
  process.env.NETGSM_USER_CODE && process.env.NETGSM_PASSWORD
)

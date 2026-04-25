// NetGSM REST v2 API — POST + HTTP Basic Auth
// Endpoint: https://api.netgsm.com.tr/sms/rest/v2/send
// Başarı: { code: "00", jobid: "...", description: "queued" }
// NOT: GET metodu 19.04.2022'den beri desteklenmemektedir.

const NETGSM_API_URL = 'https://api.netgsm.com.tr/sms/rest/v2/send'

interface SendSmsParams {
  phone: string
  message: string
}

interface SendSmsResult {
  success: boolean
  messageId?: string
  error?: string
  raw?: string
}

const ERROR_CODES: Record<string, string> = {
  '20': 'Mesaj metni hatalı veya karakter sınırı aşıldı',
  '30': 'Geçersiz kullanıcı adı/şifre veya API erişim izni yok (IP kısıtlaması olabilir)',
  '40': 'Mesaj başlığı (gönderici adı) sistemde tanımlı değil',
  '50': 'Hesabınızla İYS kontrollü gönderim yapılamıyor',
  '51': 'Aboneliğe tanımlı İYS Marka bilgisi bulunamadı',
  '70': 'Hatalı parametre veya zorunlu alan eksik',
  '80': 'Gönderim sınırı aşıldı',
  '85': "1 dakika içinde aynı numaraya 20'den fazla istek yapıldı",
}

function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('90')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits // 5XXXXXXXXX (10 hane)
}

export async function sendSms({ phone, message }: SendSmsParams): Promise<SendSmsResult> {
  const usercode = process.env.NETGSM_USER_CODE
  const password = process.env.NETGSM_PASSWORD
  const msgheader = process.env.NETGSM_HEADER || 'HMNSLNYZLM'

  if (!usercode || !password) {
    console.log(`[SMS MOCK] To: ${phone} | ${message}`)
    return { success: true, messageId: `mock-${Date.now()}` }
  }

  const gsmno = normalizePhone(phone)

  if (!gsmno || gsmno.length < 10) {
    console.error(`[NetGSM] Geçersiz telefon: "${phone}" → "${gsmno}"`)
    return { success: false, error: 'Geçersiz telefon numarası' }
  }

  const credentials = Buffer.from(`${usercode}:${password}`).toString('base64')

  const body = {
    msgheader,
    messages: [{ msg: message, no: gsmno }],
    encoding: 'TR',
    iysfilter: '0',
    appname: 'hemensalon',
  }

  console.log(`[NetGSM] Gönderiliyor → ${gsmno} | Başlık: ${msgheader}`)

  try {
    const response = await fetch(NETGSM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })

    const raw = await response.text()
    console.log(`[NetGSM] Yanıt (${response.status}): ${raw}`)

    let result: { code: string; jobid?: string; description?: string }
    try {
      result = JSON.parse(raw)
    } catch {
      return { success: false, error: `Beklenmeyen yanıt: ${raw}`, raw }
    }

    if (result.code === '00' || result.code === '01' || result.code === '02') {
      return { success: true, messageId: result.jobid ?? '', raw }
    }

    const errorMsg = ERROR_CODES[result.code] ?? `NetGSM Hatası ${result.code}: ${result.description}`
    console.error(`[NetGSM] Hata: ${result.code} → ${errorMsg}`)
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

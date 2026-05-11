export type AppLanguage = 'tr' | 'en' | 'de' | 'ar'

/**
 * Türkiye telefon numarası tespiti.
 * Desteklenen formatlar: +90XXXXXXXXXX, 090XXXXXXXXXX, 05XXXXXXXX, 5XXXXXXXXX
 */
export function isTurkishPhone(phone: string | null | undefined): boolean {
  if (!phone) return false
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('90') && digits.length === 12) return true
  if (digits.startsWith('05') && digits.length === 11) return true
  if (digits.startsWith('5') && digits.length === 10) return true
  return false
}

// Ülke kodu → dil eşlemesi
const COUNTRY_CODE_TO_LANG: Record<string, AppLanguage> = {
  '90':  'tr', // Türkiye
  '49':  'de', // Almanya
  '43':  'de', // Avusturya
  '41':  'de', // İsviçre (DE)
  '966': 'ar', // Suudi Arabistan
  '971': 'ar', // BAE
  '965': 'ar', // Kuveyt
  '974': 'ar', // Katar
  '973': 'ar', // Bahreyn
  '968': 'ar', // Umman
  '962': 'ar', // Ürdün
  '961': 'ar', // Lübnan
  '963': 'ar', // Suriye
  '964': 'ar', // Irak
  '20':  'ar', // Mısır
  '213': 'ar', // Cezayir
  '212': 'ar', // Fas
  '216': 'ar', // Tunus
  '218': 'ar', // Libya
  '249': 'ar', // Sudan
}

/**
 * Telefon numarasından uygulama dilini tespit eder.
 * Tanımlanamayan ülkeler için 'en' döner.
 */
export function detectLanguageFromPhone(phone: string | null | undefined): AppLanguage {
  if (!phone) return 'en'
  const digits = phone.replace(/\D/g, '')

  // Önce Türkiye kontrolü (yerel formatlarda da çalışsın)
  if (isTurkishPhone(phone)) return 'tr'

  // 3 haneli ülke kodlarını dene
  const code3 = digits.startsWith('00') ? digits.slice(2, 5) : digits.slice(0, 3)
  if (COUNTRY_CODE_TO_LANG[code3]) return COUNTRY_CODE_TO_LANG[code3]

  // 2 haneli ülke kodlarını dene
  const code2 = digits.startsWith('00') ? digits.slice(2, 4) : digits.slice(0, 2)
  if (COUNTRY_CODE_TO_LANG[code2]) return COUNTRY_CODE_TO_LANG[code2]

  return 'en'
}

/**
 * Türkiye telefon numarası tespiti.
 * Desteklenen formatlar: +90XXXXXXXXXX, 090XXXXXXXXXX, 05XXXXXXXX, 5XXXXXXXXX
 */
export function isTurkishPhone(phone: string | null | undefined): boolean {
  if (!phone) return false
  const digits = phone.replace(/\D/g, '')
  // +90 veya 0090 ile başlıyor
  if (digits.startsWith('90') && digits.length === 12) return true
  // 0 ile başlayıp 5 ile devam ediyor (Türkiye mobil)
  if (digits.startsWith('05') && digits.length === 11) return true
  // Direkt 5 ile başlıyor (10 hane)
  if (digits.startsWith('5') && digits.length === 10) return true
  return false
}

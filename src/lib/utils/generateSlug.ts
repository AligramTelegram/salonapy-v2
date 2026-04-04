const TR_MAP: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
}

function normalizeTR(str: string): string {
  return str
    .split('')
    .map((c) => TR_MAP[c] ?? c)
    .join('')
}

/** Blog başlığından SEO uyumlu slug (random suffix yok) */
export function generateBlogSlug(title: string): string {
  return normalizeTR(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** "Ayşe Yılmaz" → "ayse-yilmaz-k3x9" */
export function generateSlug(name: string): string {
  const base = normalizeTR(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)

  const suffix = Math.random().toString(36).slice(2, 6) // 4-char random
  return `${base}-${suffix}`
}

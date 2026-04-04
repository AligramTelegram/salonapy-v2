/**
 * Client-side CSV download utility with Turkish character support (UTF-8 BOM).
 */
export function downloadCSV(
  data: Record<string, unknown>[],
  filename: string,
  headers?: string[]
) {
  if (data.length === 0) return

  const keys = headers ?? Object.keys(data[0])

  function escapeField(value: unknown): string {
    const str = String(value ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const lines = [
    keys.map(escapeField).join(','),
    ...data.map((row) =>
      keys.map((k) => escapeField(row[k])).join(',')
    ),
  ]

  // BOM prefix for Turkish character support in Excel
  const csv = '\uFEFF' + lines.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

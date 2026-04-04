export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): { error: string; status: number; code?: string } {
  if (error instanceof ApiError) {
    return { error: error.message, status: error.status, code: error.code }
  }
  if (error instanceof Error) {
    return { error: error.message, status: 500 }
  }
  return { error: 'Beklenmeyen bir hata oluştu', status: 500 }
}

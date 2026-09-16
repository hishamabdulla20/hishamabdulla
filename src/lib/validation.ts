export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function text(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength + 1) : ''
}

export function optionalUrl(value: FormDataEntryValue | null): string | null {
  const candidate = text(value, 2_048)
  if (!candidate) return null

  try {
    const url = new URL(candidate)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export function commaSeparated(value: FormDataEntryValue | null, limit = 20): string[] {
  return text(value, 2_000)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit)
}

export function isEmail(value: string): boolean {
  return emailPattern.test(value) && value.length <= 254
}

export function isSlug(value: string): boolean {
  return slugPattern.test(value) && value.length <= 160
}

export function isUuid(value: string): boolean {
  return uuidPattern.test(value)
}

export function required(value: string, maxLength: number): boolean {
  return value.length > 0 && value.length <= maxLength
}

export function safeError(context: string, error: unknown): void {
  console.error(`[portfolio:${context}]`, error instanceof Error ? error.message : 'Unknown error')
}

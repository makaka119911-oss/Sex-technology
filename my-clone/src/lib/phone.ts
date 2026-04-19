/** Нормализация для хранения и поиска по телефону */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "")
}

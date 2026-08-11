export function formatPrice(value: string | number): string {
  const num = Number(value)
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2)
}

export function formatCurrency(value: string | number): string {
  return `$${formatPrice(value)}`
}

export function formatDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export function formatTime(iso: string | Date): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateTime(iso: string | Date): {
  date: string
  time: string
} {
  return { date: formatDate(iso), time: formatTime(iso) }
}

export function formatShortMonth(iso: string | Date): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short" })
}

export function formatRating(value: number | null | undefined): string {
  return value ? value.toFixed(1) : "—"
}

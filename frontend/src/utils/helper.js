const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const getInitials = (name) => {
  if (!name) return ''

  const words = name.trim().split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toLocaleUpperCase()
}

// INR formatting: lakh/crore grouping (en-IN), always 2 decimals, e.g. ₹12,34,567.50
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatINR = (amount) => {
  const value = Number(amount)
  if (amount == null || amount === '' || !Number.isFinite(value)) return ''
  return inrFormatter.format(value)
}

// Compact axis labels in the Indian system: 1.5K, 2.3L (lakh), 1.2Cr (crore).
export const formatINRCompact = (amount) => {
  const value = Number(amount)
  if (!Number.isFinite(value)) return ''
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  const trim = (n) => String(Number(n.toFixed(1)))
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7)}Cr`
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5)}L`
  if (abs >= 1e3) return `${sign}₹${trim(abs / 1e3)}K`
  return `${sign}₹${trim(abs)}`
}

const ordinalDay = (day) => {
  const mod100 = day % 100
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

export const formatTransactionDate = (value, style = 'list') => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  if (style === 'chart') {
    return `${day}-${MONTHS[month]}-${year}`
  }

  if (style === 'recent') {
    return `${ordinalDay(day)} ${MONTHS[month]} ${year}`
  }

  return `${ordinalDay(day)} ${String(month + 1).padStart(2, '0')} ${year}`
}

export const prepareChartData = (data = [], labelKey) => {
  return [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      month: formatTransactionDate(item?.date, 'chart'),
      category: item?.[labelKey],
      amount: item?.amount,
    }))
}

export const prepareIncomeBarCharData = (data = []) =>
  prepareChartData(data, 'source')

export const prepareExpenseLineChartData = (data = []) =>
  prepareChartData(data, 'category')

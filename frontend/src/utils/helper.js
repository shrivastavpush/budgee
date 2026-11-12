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

export const addThousandSeparator = (num) => {
  if (num == null || isNaN(num)) return ''

  const [integerPart, fractionalPart] = num.toString().split('.')

  let lastThree = integerPart.slice(-3)
  let rest = integerPart.slice(0, -3)

  if (rest) {
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  }

  const formattedInteger = rest ? `${rest},${lastThree}` : lastThree

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger
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

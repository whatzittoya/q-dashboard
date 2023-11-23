export const autoFormat = (number, type) => {
  switch (type) {
    case 'number':
      return formatNumber(number)
    case 'currency':
      console.log(formatCurrency(number))
      return formatCurrency(number)
    case 'percent':
      return formatPercent(number)
    default:
      return number
  }
}
export const formatNumber = (number) => {
  return isNumber(number)
    ? roundToTwo(number)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : number
}

export const formatCurrency = (number) => {
  return isNumber(number)
    ? roundToTwo(number)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : number
}

export const formatPercent = (number) => {
  return isNumber(number) ? roundToTwo(number) * 100 + '%' : number
}
function isNumber(value) {
  try {
    return typeof parseInt(value) === 'number'
  } catch {
    return false
  }
}

function roundToTwo(num) {
  return +(Math.round(parseFloat(num) + 'e+2') + 'e-2')
}

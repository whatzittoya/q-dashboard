
export const autoFormat = (number, type) => {
  // return number
  switch (type) {
    case 'number':
      return formatNumber(number)
    case 'currency':
      return formatCurrency(number)
    case 'percent':
      return formatPercent(number)
    case 'text':

      return String(number)
    default:
      
      if(type === undefined) return number
      else if (type.toString().includes('url')){
        const url=type.split('-')[1]
        const new_url=url.replace('{id}',number)
        return `<a href='${new_url}' clas>${number}</a>`
    }
     
  }
}
export const formatNumber = (number) => {
  if(number===undefined) return 0
  return isNumber(number)
    ? roundToTwo(number)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : number
}

export const formatCurrency = (number) => {
  if(number===undefined || number==null) return 0
  return isNumber(number)
    ? parseFloat(number)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : number
}

export const formatPercent = (number) => {
  return isNumber(number) ? parseFloat(number * 100).toFixed(2) + '%' : number
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
  //   return +(Math.round(parseFloat(num) + 'e+2') + 'e-2')
}

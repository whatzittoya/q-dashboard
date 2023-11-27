export const calculateGrandTotal = (data, propertiesToSum) => {
  let grandTotal = 0

  propertiesToSum.forEach((property) => {
    let amount = parseFloat(data[property]) || 0
    if (property == 'discount') {
      amount = amount * -1
    }
    grandTotal += amount
  })

  return grandTotal
}

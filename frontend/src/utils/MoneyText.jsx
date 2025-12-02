import { formatCurrencyAR } from './money.js'

export const MoneyText = ({ value }) => {
  const str = formatCurrencyAR(value)
  return (
    <span>{str}</span>
  )
}


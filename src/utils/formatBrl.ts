const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBrl(amount: number): string {
  return brl.format(amount)
}

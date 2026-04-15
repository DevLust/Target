import { TransactionData } from '@/components/Transaction'
import { TargetCardData } from '@/components/TargetCard'
import { TransactionTypes } from '@/utils/TransactionTypes'

export const homeSummary = {
  total: 'R$ 2.680,00',
  input: { label: 'Entradas', value: 'R$ 6.184,90' },
  output: { label: 'Saídas', value: '-R$ 883,65' },
}

export const targets: TargetCardData[] = [
  {
    id: '1',
    name: 'Apple Watch',
    current: 'R$ 580,00',
    target: 'R$ 1.790,00',
    percentage: 32,
  },
  {
    id: '2',
    name: 'Comprar uma cadeira ergonômica',
    current: 'R$ 400,00',
    target: 'R$ 1.200,00',
    percentage: 33,
  },
  {
    id: '3',
    name: 'Fazer uma viagem para o Rio de Janeiro',
    current: 'R$ 1.200,00',
    target: 'R$ 4.000,00',
    percentage: 30,
  },
]

export type GoalDetail = {
  title: string
  current: string
  target: string
  targetAmount: number
  percentage: number
}

const goalDetails: Record<string, GoalDetail> = {
  '1': {
    title: 'Apple Watch',
    current: 'R$ 580,00',
    target: 'R$ 1.790,00',
    targetAmount: 1790,
    percentage: 32,
  },
  '2': {
    title: 'Comprar uma cadeira ergonômica',
    current: 'R$ 400,00',
    target: 'R$ 1.200,00',
    targetAmount: 1200,
    percentage: 33,
  },
  '3': {
    title: 'Fazer uma viagem para o Rio de Janeiro',
    current: 'R$ 1.200,00',
    target: 'R$ 4.000,00',
    targetAmount: 4000,
    percentage: 30,
  },
}

export function getGoalDetail(id: string): GoalDetail {
  return (
    goalDetails[id] ?? {
      title: 'Meta',
      current: 'R$ 0,00',
      target: 'R$ 0,00',
      targetAmount: 0,
      percentage: 0,
    }
  )
}

const transactionsByGoal: Record<string, TransactionData[]> = {
  '1': [
    {
      id: 't1',
      title: 'Guardar',
      value: 'R$ 300,00',
      type: TransactionTypes.Input,
      subtitle: '15/04/2026 — CDB de 110% no banco XPTO',
    },
    {
      id: 't2',
      title: 'Resgatar',
      value: 'R$ 20,00',
      type: TransactionTypes.Output,
      subtitle: '10/04/2026 — Saque para despesa',
    },
  ],
  '2': [],
  '3': [],
}

export function getTransactionsForGoal(id: string): TransactionData[] {
  return transactionsByGoal[id] ?? []
}

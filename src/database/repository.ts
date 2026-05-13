import type { SQLiteDatabase } from 'expo-sqlite'
import type { TargetCardData } from '@/components/TargetCard'
import type { TransactionData } from '@/components/Transaction'
import type { HomeHeaderData } from '@/components/HomeHeader'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { formatBrl } from '@/utils/formatBrl'

type TargetAggRow = {
  id: number
  name: string
  goal: number
  accumulated: number
}

type TargetRow = {
  id: number
  name: string
  amount: number
}

type TxRow = {
  id: number
  amount: number
  observation: string | null
  created_at: string
}

function formatDbDatePrefix(createdAt: string): string {
  const m = createdAt.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return createdAt
  return `${m[3]}/${m[2]}/${m[1]}`
}

function toTransactionData(row: TxRow): TransactionData {
  const isInput = row.amount >= 0
  const obs = row.observation?.trim()
  const dateStr = formatDbDatePrefix(row.created_at)
  return {
    id: String(row.id),
    title: isInput ? 'Guardar' : 'Resgatar',
    value: formatBrl(Math.abs(row.amount)),
    type: isInput ? TransactionTypes.Input : TransactionTypes.Output,
    subtitle: obs ? `${dateStr} — ${obs}` : dateStr,
  }
}

function percentageFor(goal: number, accumulated: number): number {
  if (goal <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((accumulated / goal) * 100)))
}

export async function fetchTargetsForList(db: SQLiteDatabase): Promise<TargetCardData[]> {
  const rows = await db.getAllAsync<TargetAggRow>(
    `SELECT
      t.id,
      t.name,
      t.amount AS goal,
      COALESCE(SUM(tr.amount), 0) AS accumulated
    FROM targets t
    LEFT JOIN transactions tr ON tr.target_id = t.id
    GROUP BY t.id
    ORDER BY
      CASE
        WHEN t.amount > 0 THEN COALESCE(SUM(tr.amount), 0) / t.amount
        ELSE 0
      END DESC,
      t.updated_at DESC;`,
  )

  return rows.map((r) => ({
    id: String(r.id),
    name: r.name,
    current: formatBrl(r.accumulated),
    target: formatBrl(r.goal),
    percentage: percentageFor(r.goal, r.accumulated),
  }))
}

export async function fetchHomeSummary(db: SQLiteDatabase): Promise<HomeHeaderData> {
  const totalRow = await db.getFirstAsync<{ net: number }>(
    `SELECT COALESCE(SUM(amount), 0) AS net FROM transactions;`,
  )
  const inRow = await db.getFirstAsync<{ v: number }>(
    `SELECT COALESCE(SUM(amount), 0) AS v FROM transactions WHERE amount > 0;`,
  )
  const outRow = await db.getFirstAsync<{ v: number }>(
    `SELECT COALESCE(SUM(amount), 0) AS v FROM transactions WHERE amount < 0;`,
  )

  const net = totalRow?.net ?? 0
  const inputs = inRow?.v ?? 0
  const outputs = outRow?.v ?? 0

  return {
    total: formatBrl(net),
    input: { label: 'Entradas', value: formatBrl(inputs) },
    output: { label: 'Saídas', value: formatBrl(outputs) },
  }
}

export async function fetchTargetById(db: SQLiteDatabase, id: number): Promise<TargetRow | null> {
  return db.getFirstAsync<TargetRow>('SELECT id, name, amount FROM targets WHERE id = ?;', [id])
}

export async function fetchAccumulatedForTarget(db: SQLiteDatabase, targetId: number): Promise<number> {
  const row = await db.getFirstAsync<{ s: number }>(
    'SELECT COALESCE(SUM(amount), 0) AS s FROM transactions WHERE target_id = ?;',
    [targetId],
  )
  return row?.s ?? 0
}

export type GoalDetailDb = {
  title: string
  current: string
  target: string
  targetAmount: number
  percentage: number
}

export async function fetchGoalDetail(db: SQLiteDatabase, id: number): Promise<GoalDetailDb | null> {
  const t = await fetchTargetById(db, id)
  if (!t) return null
  const acc = await fetchAccumulatedForTarget(db, id)
  return {
    title: t.name,
    current: formatBrl(acc),
    target: formatBrl(t.amount),
    targetAmount: t.amount,
    percentage: percentageFor(t.amount, acc),
  }
}

export async function fetchTransactionsForTarget(
  db: SQLiteDatabase,
  targetId: number,
): Promise<TransactionData[]> {
  const rows = await db.getAllAsync<TxRow>(
    `SELECT id, amount, observation, created_at
     FROM transactions
     WHERE target_id = ?
     ORDER BY datetime(created_at) DESC, id DESC;`,
    [targetId],
  )
  return rows.map(toTransactionData)
}

export async function insertTarget(db: SQLiteDatabase, name: string, amount: number): Promise<number> {
  const res = await db.runAsync(
    `INSERT INTO targets (name, amount) VALUES ($name, $amount);`,
    { $name: name.trim(), $amount: amount },
  )
  return Number(res.lastInsertRowId)
}

export async function updateTarget(
  db: SQLiteDatabase,
  id: number,
  name: string,
  amount: number,
): Promise<void> {
  await db.runAsync(
    `UPDATE targets
     SET name = $name, amount = $amount, updated_at = datetime('now')
     WHERE id = $id;`,
    { $name: name.trim(), $amount: amount, $id: id },
  )
}

export async function deleteTarget(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM targets WHERE id = ?;', [id])
}

export async function insertTransaction(
  db: SQLiteDatabase,
  targetId: number,
  signedAmount: number,
  observation: string | null,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO transactions (target_id, amount, observation)
     VALUES ($target_id, $amount, $observation);`,
    {
      $target_id: targetId,
      $amount: signedAmount,
      $observation: observation?.trim() || null,
    },
  )
}

export async function deleteTransaction(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM transactions WHERE id = ?;', [id])
}

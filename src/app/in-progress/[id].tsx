import { Alert, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScreenHeader } from '@/components/ScreenHeader'
import { Loading } from '@/components/Loading'
import { Button } from '@/components/Button'
import { Progress } from '@/components/Progress'
import { List } from '@/components/List'
import { Transaction, type TransactionData } from '@/components/Transaction'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import {
  deleteTransaction,
  fetchGoalDetail,
  fetchTransactionsForTarget,
  type GoalDetailDb,
} from '@/database/repository'

export default function InProgress() {
  const insets = useSafeAreaInsets()
  const db = useSQLiteContext()
  const params = useLocalSearchParams<{ id: string }>()
  const goalId = Number(params.id)

  const [detail, setDetail] = useState<GoalDetailDb | null>(null)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [bootstrapped, setBootstrapped] = useState(false)

  const load = useCallback(async () => {
    if (Number.isNaN(goalId)) {
      setDetail(null)
      setTransactions([])
      setBootstrapped(true)
      return
    }
    const [d, txs] = await Promise.all([
      fetchGoalDetail(db, goalId),
      fetchTransactionsForTarget(db, goalId),
    ])
    setDetail(d)
    setTransactions(txs)
    setBootstrapped(true)
  }, [db, goalId])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

  const onRemoveTx = useCallback(
    (txId: string) => {
      Alert.alert('Excluir transação', 'Remover este registro?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(db, Number(txId))
              await load()
            } catch (e) {
              console.error(e)
              Alert.alert('Erro', 'Não foi possível excluir a transação.')
            }
          },
        },
      ])
    },
    [db, load],
  )

  if (!bootstrapped) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Loading />
      </View>
    )
  }

  if (Number.isNaN(goalId) || !detail) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, padding: 24, justifyContent: 'center', gap: 16 }}>
        <Text style={{ fontFamily: fontFamily.regular, color: colors.gray[600] }}>
          Meta não encontrada.
        </Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: insets.bottom + 100,
          gap: 24,
        }}
      >
        <ScreenHeader
          title={detail.title}
          onRightPress={() => router.navigate({ pathname: '/target', params: { id: params.id } })}
        />

        <View style={{ gap: 12 }}>
          <Text style={{ fontFamily: fontFamily.medium, color: colors.gray[600] }}>Valor guardado</Text>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: colors.black }}>
            {detail.current} de {detail.target}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Progress percentage={detail.percentage} />
            </View>
            <Text style={{ fontFamily: fontFamily.bold, color: colors.blue[500], minWidth: 40 }}>
              {Math.round(detail.percentage)}%
            </Text>
          </View>
        </View>

        <List
          title="Transações"
          data={transactions}
          scrollEnabled={false}
          renderItem={({ item }) => <Transaction data={item} onRemove={() => onRemoveTx(item.id)} />}
          emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
        />
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 24,
          paddingBottom: Math.max(insets.bottom, 16),
          paddingTop: 12,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
        }}
      >
        <Button title="Nova transação" onPress={() => router.navigate(`/transaction/${params.id}`)} />
      </View>
    </View>
  )
}

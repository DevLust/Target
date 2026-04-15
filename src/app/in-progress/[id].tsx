import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScreenHeader } from '@/components/ScreenHeader'
import { Button } from '@/components/Button'
import { Progress } from '@/components/Progress'
import { List } from '@/components/List'
import { Transaction } from '@/components/Transaction'
import { getGoalDetail, getTransactionsForGoal } from '@/data/mock'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

export default function InProgress() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ id: string }>()
  const detail = getGoalDetail(params.id)
  const transactions = getTransactionsForGoal(params.id)

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
          renderItem={({ item }) => (
            <Transaction data={item} onRemove={() => {}} />
          )}
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
        <Button
          title="Nova transação"
          onPress={() => router.navigate(`/transaction/${params.id}`)}
        />
      </View>
    </View>
  )
}

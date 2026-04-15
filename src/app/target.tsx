import { Alert, ScrollView, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { ScreenHeader } from '@/components/ScreenHeader'
import { Input } from '@/components/Input'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Button } from '@/components/Button'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { getGoalDetail } from '@/data/mock'

export default function TargetScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const isEdit = !!id
  const detail = id ? getGoalDetail(id) : null

  const [name, setName] = useState(detail?.title ?? '')
  const [targetAmount, setTargetAmount] = useState<number | null>(
    detail ? detail.targetAmount : null,
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: insets.bottom + 24,
          gap: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title=""
          rightIcon={isEdit ? 'delete-outline' : undefined}
          onRightPress={
            isEdit
              ? () =>
                  Alert.alert(
                    'Excluir meta',
                    'Tem certeza que deseja remover esta meta?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Excluir', style: 'destructive', onPress: () => router.back() },
                    ],
                  )
              : undefined
          }
        />

        <Text style={{ fontFamily: fontFamily.bold, fontSize: 22, color: colors.black }}>
          {isEdit ? 'Meta' : 'Nova meta'}
        </Text>

        <Text style={{ fontFamily: fontFamily.regular, fontSize: 14, color: colors.gray[600] }}>
          Economize para alcançar sua meta financeira.
        </Text>

        <Input
          label="Nome da meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          value={name}
          onChangeText={setName}
        />

        <CurrencyInput label="Valor alvo (R$)" value={targetAmount} onChangeValue={setTargetAmount} />
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: Math.max(insets.bottom, 16),
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
        }}
      >
        <Button title="Salvar" onPress={() => router.back()} />
      </View>
    </View>
  )
}

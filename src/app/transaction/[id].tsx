import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { ScreenHeader } from '@/components/ScreenHeader'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { TransactionType } from '@/components/TransactionType'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

export default function TransactionScreen() {
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ id: string }>()
  const [type, setType] = useState(TransactionTypes.Input)
  const [value, setValue] = useState<number | null>(50)
  const [reason, setReason] = useState('')

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
        <ScreenHeader title="Nova transação" />

        <Text style={{ fontFamily: fontFamily.regular, fontSize: 14, color: colors.gray[600] }}>
          Registre valores que você guarda ou resgata desta meta para acompanhar o progresso.
        </Text>

        <TransactionType selected={type} onChange={setType} />

        <CurrencyInput label="Valor (R$)" value={value} onChangeValue={setValue} />

        <Input
          label="Motivo (opcional)"
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
          value={reason}
          onChangeText={setReason}
        />
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
        <Button title="Salvar" onPress={() => {}} />
      </View>
    </View>
  )
}

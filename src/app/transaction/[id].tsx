import { Alert, ScrollView, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useCallback } from 'react'
import { ScreenHeader } from '@/components/ScreenHeader'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { TransactionType } from '@/components/TransactionType'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { fetchTargetById, insertTransaction } from '@/database/repository'

export default function TransactionScreen() {
  const insets = useSafeAreaInsets()
  const db = useSQLiteContext()
  const params = useLocalSearchParams<{ id: string }>()
  const targetId = Number(params.id)

  const [type, setType] = useState(TransactionTypes.Input)
  const [value, setValue] = useState<number | null>(50)
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSave = useCallback(async () => {
    if (Number.isNaN(targetId)) {
      Alert.alert('Erro', 'Meta inválida.')
      return
    }
    const exists = await fetchTargetById(db, targetId)
    if (!exists) {
      Alert.alert('Erro', 'Meta não encontrada.')
      return
    }
    if (value == null || value <= 0) {
      Alert.alert('Atenção', 'Informe um valor maior que zero.')
      return
    }

    const signed = type === TransactionTypes.Input ? value : -value

    setIsProcessing(true)
    try {
      await insertTransaction(db, targetId, signed, reason || null)
      Alert.alert('Sucesso', 'Transação registrada.', [{ text: 'OK', onPress: () => router.back() }])
    } catch (e) {
      console.error(e)
      Alert.alert('Erro', 'Não foi possível salvar a transação.')
    } finally {
      setIsProcessing(false)
    }
  }, [db, reason, targetId, type, value])

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
        <Button title="Salvar" onPress={handleSave} isLoading={isProcessing} />
      </View>
    </View>
  )
}

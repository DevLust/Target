import { Alert, ScrollView, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCallback, useEffect, useState } from 'react'
import { ScreenHeader } from '@/components/ScreenHeader'
import { Input } from '@/components/Input'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Button } from '@/components/Button'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import {
  deleteTarget,
  fetchTargetById,
  insertTarget,
  updateTarget,
} from '@/database/repository'

export default function TargetScreen() {
  const insets = useSafeAreaInsets()
  const db = useSQLiteContext()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const isEdit = !!id
  const targetId = id ? Number(id) : NaN

  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!isEdit || Number.isNaN(targetId)) {
      setName('')
      setTargetAmount(null)
      return
    }
    ;(async () => {
      const row = await fetchTargetById(db, targetId)
      if (cancelled || !row) return
      setName(row.name)
      setTargetAmount(row.amount)
    })()
    return () => {
      cancelled = true
    }
  }, [db, isEdit, targetId])

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Preencha o nome da meta.')
      return
    }
    if (targetAmount == null || targetAmount <= 0) {
      Alert.alert('Atenção', 'O valor alvo precisa ser maior que zero.')
      return
    }

    setIsProcessing(true)
    try {
      if (isEdit && !Number.isNaN(targetId)) {
        await updateTarget(db, targetId, name, targetAmount)
        Alert.alert('Sucesso', 'Meta atualizada.', [{ text: 'OK', onPress: () => router.back() }])
      } else {
        await insertTarget(db, name, targetAmount)
        Alert.alert('Sucesso', 'Meta criada.', [{ text: 'OK', onPress: () => router.back() }])
      }
    } catch (e) {
      console.error(e)
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }, [db, isEdit, name, targetAmount, targetId])

  const handleDelete = useCallback(async () => {
    if (Number.isNaN(targetId)) return
    setIsProcessing(true)
    try {
      await deleteTarget(db, targetId)
      router.back()
    } catch (e) {
      console.error(e)
      Alert.alert('Erro', 'Não foi possível excluir a meta.')
    } finally {
      setIsProcessing(false)
    }
  }, [db, targetId])

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
                  Alert.alert('Excluir meta', 'Tem certeza que deseja remover esta meta?', [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', style: 'destructive', onPress: handleDelete },
                  ])
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
        <Button title="Salvar" onPress={handleSave} isLoading={isProcessing} />
      </View>
    </View>
  )
}

import { Dimensions, FlatList, Platform, Text, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HomeHeader, type HomeHeaderData } from '@/components/HomeHeader'
import { Button } from '@/components/Button'
import { TargetCard, type TargetCardData } from '@/components/TargetCard'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'
import { fetchHomeSummary, fetchTargetsForList } from '@/database/repository'
import { formatBrl } from '@/utils/formatBrl'

const emptySummary: HomeHeaderData = {
  total: formatBrl(0),
  input: { label: 'Entradas', value: formatBrl(0) },
  output: { label: 'Saídas', value: formatBrl(0) },
}

export default function Index() {
  const insets = useSafeAreaInsets()
  const db = useSQLiteContext()
  const [targets, setTargets] = useState<TargetCardData[]>([])
  const [summary, setSummary] = useState<HomeHeaderData>(emptySummary)

  const load = useCallback(async () => {
    const [list, home] = await Promise.all([fetchTargetsForList(db), fetchHomeSummary(db)])
    setTargets(list)
    setSummary(home)
  }, [db])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

  const rootStyle =
    Platform.OS === 'web'
      ? {
          flex: 1,
          minHeight: Dimensions.get('window').height,
          backgroundColor: colors.white,
        }
      : { flex: 1, backgroundColor: colors.white }

  return (
    <View style={rootStyle}>
      <FlatList
        style={{ flex: 1 }}
        data={targets}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <HomeHeader data={summary} />
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: 18,
                color: colors.black,
                paddingHorizontal: 24,
                marginTop: 24,
                marginBottom: 8,
              }}
            >
              Metas
            </Text>
          </View>
        }
        ListHeaderComponentStyle={{ marginBottom: 0 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 24 }}>
            <TargetCard
              data={item}
              onPress={() => router.navigate(`/in-progress/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.gray[500], fontFamily: fontFamily.regular, paddingHorizontal: 24 }}>
            Nenhuma meta. Toque em nova meta para criar.
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
      />

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
        <Button title="Nova meta" onPress={() => router.navigate('/target')} />
      </View>
    </View>
  )
}

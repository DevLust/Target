import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

export type TargetCardData = {
  id: string
  name: string
  current: string
  target: string
  percentage: number
}

type Props = {
  data: TargetCardData
  onPress: () => void
}

export function TargetCard({ data, onPress }: Props) {
  const pct = Math.max(0, Math.min(data.percentage, 100))

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontFamily: fontFamily.bold, fontSize: 16, color: colors.black }}>
          {data.name}
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontFamily: fontFamily.regular,
            fontSize: 14,
            color: colors.gray[600],
          }}
        >
          {pct}% • {data.current} de {data.target}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.gray[400]} />
    </Pressable>
  )
}

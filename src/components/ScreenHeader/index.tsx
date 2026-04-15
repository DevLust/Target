import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/theme/colors'
import { fontFamily } from '@/theme/fontFamily'

type Props = {
  title: string
  subtitle?: string
  onRightPress?: () => void
  rightIcon?: keyof typeof MaterialIcons.glyphMap
}

export function ScreenHeader({ title, subtitle, onRightPress, rightIcon = 'edit' }: Props) {
  return (
    <View style={{ gap: subtitle ? 8 : 0 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </Pressable>

        {title ? (
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: fontFamily.bold,
              fontSize: 18,
              color: colors.black,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {onRightPress ? (
          <Pressable onPress={onRightPress} hitSlop={12}>
            <MaterialIcons name={rightIcon} size={24} color={colors.black} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {subtitle ? (
        <Text style={{ color: colors.gray[600], fontFamily: fontFamily.regular, fontSize: 14 }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  )
}

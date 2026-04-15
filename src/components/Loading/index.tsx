import { ActivityIndicator, Dimensions, Platform, View } from 'react-native'
import { colors } from '@/theme/colors'

export function Loading() {
  const minH = Platform.OS === 'web' ? Dimensions.get('window').height : undefined

  return (
    <View
      style={{
        flex: 1,
        minHeight: minH,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={colors.blue[500]} />
    </View>
  )
}

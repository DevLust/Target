import { Stack } from 'expo-router'
import { Dimensions, Platform, View, type ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@/theme/colors'
import { Loading } from '@/components/Loading'
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter'

const windowH = Dimensions.get('window').height
const rootWeb: ViewStyle =
  Platform.OS === 'web'
    ? { flex: 1, minHeight: windowH, width: '100%' }
    : { flex: 1 }

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  })

  // Na web, não bloquear a árvore: primeiro frame com altura 0 + Loading em flex:1 vira tela “vazia”.
  const fontsReady = Platform.OS === 'web' || fontsLoaded

  if (!fontsReady) {
    return (
      <View style={[{ backgroundColor: colors.white }, rootWeb]}>
        <Loading />
      </View>
    )
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.white }, rootWeb]}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.white, flex: 1 },
          }}
        />
      </SafeAreaProvider>
    </View>
  )
}

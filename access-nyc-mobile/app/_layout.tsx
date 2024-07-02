import 'react-native-gesture-handler';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { BottomNavigation, PaperProvider, Text } from 'react-native-paper';
import { darkTheme, lightTheme } from './theme';
import { useFonts } from 'expo-font';
import { Inter_900Black } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  let colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? lightTheme : darkTheme;

  // Fonts
  let [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

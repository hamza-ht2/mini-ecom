import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='splash' options={{ title: 'Splash' }} />
        <Stack.Screen name='login' options={{ title: 'Login' }} />
        <Stack.Screen name='register' options={{ title: 'Register' }} />
        <Stack.Screen name='(drawer)' options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  )
}

export default RootLayout
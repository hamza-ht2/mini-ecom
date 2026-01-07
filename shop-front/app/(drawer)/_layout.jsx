import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useSegments } from 'expo-router'

const DrawerDashLayout = () => {
  const [role, setRole] = useState('')
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem('role')
      setRole(storedRole)
    }
    getRole()
  }, [])

  useEffect(() => {
    if (!role) return

    // Redirect to appropriate home based on role
    const inDrawer = segments[0] === '(drawer)'
    if (inDrawer && segments.length === 1) {
      if (role === 'ADMIN') {
        router.replace('/(drawer)/(admin)/dashboard')
      } else {
        router.replace('/(drawer)/(tabs)/products')
      }
    }
  }, [role, segments])

  if (!role) return null

  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen 
        name="(admin)" 
        options={{ 
          title: 'Admin',
          headerShown: false,
          drawerItemStyle: role === 'ADMIN' ? {} : { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Home',
          headerShown: true,
          drawerItemStyle: role === 'USER' ? {} : { display: 'none' }
        }} 
      />
      <Drawer.Screen name='profile' options={{ title: 'Profile' }} />
      <Drawer.Screen name='settings' options={{ title: 'Settings' }} />
      <Drawer.Screen name='logout' options={{ title: 'Logout' }} />
    </Drawer>
  )
}

export default DrawerDashLayout

const styles = StyleSheet.create({})
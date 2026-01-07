import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../constants/Colors'
const AdminTabs = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme]
  return (
    <Tabs
        initialRouteName='dashboard'
        screenOptions={{
            headerShown:false
        }}
    >
        <Tabs.Screen name='dashboard' options={{
            title: 'Dashboard',
            tabBarIcon : ({focused})=>(<Ionicons size={24} name={focused ? 'speedometer' : 'speedometer-outline'} color={focused ? theme.iconColorFocused : theme.iconColor}  />)
        }}/>
        <Tabs.Screen name='create' options={{
            title: 'Create',
            tabBarIcon : ({focused})=>(<Ionicons size={24} name={focused ? 'create' : 'create-outline'} color={focused ? theme.iconColorFocused : theme.iconColor} />)
        }}/>
        <Tabs.Screen name='manage' options={{
            title: 'Manage',
            tabBarIcon: ({focused})=>(<Ionicons size={24} name={focused ? 'list' : 'list-outline'} color={focused ? theme.iconColorFocused : theme.iconColor} />)
        }}/>
        <Tabs.Screen name='orders' options={{
            title : 'Orders',
            tabBarIcon: ({focused})=>(<Ionicons size={24} name={focused ? 'receipt' : 'receipt-outline'} color={focused ? theme.iconColorFocused : theme.iconColor} />)
        }}/>
    </Tabs>
  )
}

export default AdminTabs
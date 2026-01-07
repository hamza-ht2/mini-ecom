import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {Ionicons} from '@expo/vector-icons'
import {Colors} from '../../../constants/Colors'
const UserTabs = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
  return (
    <Tabs
        initialRouteName='products'
        screenOptions={{
            headerShown:false
        }}
    >
        <Tabs.Screen name='products' options={{
            title: 'Products',
            tabBarIcon : ({focused})=>(<Ionicons size={24} name={focused ? 'pricetag' : 'pricetag-outline'} color={focused ? theme.iconColorFocused : theme.iconColor }  />)
        }}/>
        <Tabs.Screen name='cart' options={{
            title:'Cart',
            tabBarIcon: ({focused})=>(<Ionicons size={24} name={focused ? 'cart' : 'cart-outline'} color={focused ? theme.iconColorFocused : theme.iconColor}  />)
        }}/>
        <Tabs.Screen name='orders' options={{
            title: 'Orders',
            tabBarIcon : ({focused})=> (<Ionicons size={24} name={focused ? 'receipt' : 'receipt-outline'} color={focused ? theme.iconColorFocused : theme.iconColor} />)
        }}/>
    </Tabs>
  )
}

export default UserTabs
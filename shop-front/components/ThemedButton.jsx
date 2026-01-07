import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const ThemedButton = ({style, ...props}) => {
  return (
    <Pressable style={({pressed})=>[styles.btn, pressed && styles.pressed , style]} {...props} />
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn : {
        backgroundColor : Colors.primary,
        padding : 16,
        borderRadius : 6,
        marginVertical : 10
    },
    pressed : {
        opacity : 0.8
    }
})
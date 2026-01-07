import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'
import ThemedButton from '../components/ThemedButton'
import ThemedTextInput from '../components/ThemedTextInput'
import { Link, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
const login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const API_URL = "http://20.31.0.48:9000/api/auth/login"
    const router = useRouter()
    const handleLogin = async ()=>{
        if(!email || !password){
            Alert.alert('Error','All fields are required')
            return
        }
        try {
            const res = await fetch(API_URL, {
                method : 'POST',
                headers : {"Content-Type": "application/json"},
                body : JSON.stringify({email, password})
            })
            const data = await res.json()
            if(!res.ok){
                Alert.alert('Error', data.message || 'Failed to Login')
                return
            }
            await AsyncStorage.setItem('token', data.token)
            await AsyncStorage.setItem('role', data.user.role)
            if(data.user.role == 'ADMIN'){
                router.replace('/(drawer)/(admin)/dashboard')
            }else{
                router.replace('/(drawer)/(tabs)/products')
            }
        } catch (error) {
            console.error(error)
            Alert.alert('Error','server error')
        }
    }
  return (
    <ThemedView style={styles.container}>
        <Spacer/>
        <ThemedText>Login</ThemedText>
        <Spacer height={30}/>
        <ThemedTextInput placeholder='email' value={email} onChangeText={setEmail}  keyboardType='email-address' style={styles.input}/>
        <ThemedTextInput placeholder='password' value={password} onChangeText={setPassword}  secureTextEntry style={styles.input}/>
        <Spacer height={10}/>
        <ThemedButton onPress={handleLogin}>
            <ThemedText style={{color : '#fff'}}>Login</ThemedText>
        </ThemedButton>
        <Link href='/register' style={styles.link}>
            <ThemedText>register instead</ThemedText>
        </Link>
    </ThemedView>
  )
}

export default login

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent: 'center',
        alignItems : 'center'
    },
    input : {
        width : '80%',
        marginBottom : 20
    },
    link : {
        borderBottomWidth: 1
    }
})
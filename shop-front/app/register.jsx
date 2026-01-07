import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'
import ThemedTextInput from '../components/ThemedTextInput'
import ThemedButton from '../components/ThemedButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
const register = () => {
    const [username , setUsername] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const API_URL = "http://20.31.0.48:9000/api/auth/register"
    const router = useRouter()
    const handleRegister = async () =>{
        if(!username || !email || !password || !confirmPassword){
            Alert.alert('Error','All fields are required')
            return
        }
        if(password !== confirmPassword){
            Alert.alert('Error','password do not match')
            return
        }
        try {
            const res = await fetch(API_URL, {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({username, email, password})
            })
            const data = await res.json()
            if(!res.ok){
                Alert.alert('Error', data.message || 'Failed to register')
                return
            }
            console.log('Registration successfull', data.token)
            router.push('/login')
        } catch (error) {
            console.error(error.message)
            Alert.alert('Error', 'server error')
        }
    }
  return (
    <ThemedView style={styles.container}>
        <Spacer/>
        <ThemedText>create an account</ThemedText>
        <Spacer height={30}/>
        <ThemedTextInput placeholder='username' value={username} onChangeText={setUsername} style={styles.input} />
        <ThemedTextInput placeholder='email' keyboardType='email-address' value={email} onChangeText={setEmail} style={styles.input} />
        <ThemedTextInput placeholder='password' secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
        <ThemedTextInput placeholder='confirm password' secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input}/>
        <Spacer height={10}/>
        <ThemedButton onPress={handleRegister}>
            <ThemedText style={{color : '#fff'}}>Register</ThemedText>
        </ThemedButton>
        <Link href='/login' style={styles.link}>
            <ThemedText>login instead</ThemedText>
        </Link>
    </ThemedView>
  )
}

export default register

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    input : {
        width : "80%",
        marginBottom : 20
    },
    link : {
        borderBottomWidth : 1
    }
})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedButton from '../components/ThemedButton'
import ThemedText from '../components/ThemedText'
import { useRouter } from 'expo-router'

const splash = () => {
  const router = useRouter()
  
  const redirectToLogin = () => {
    router.push('/login')
  }
  
  const redirectToRegister = () => {
    router.push('/register')
  }
  
  return (
    <View style={styles.container}>
      {/* Background layers for gradient effect */}
      <View style={styles.backgroundLayer1} />
      <View style={styles.backgroundLayer2} />
      <View style={styles.backgroundLayer3} />
      
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
      
      <View style={styles.content}>
        {/* Logo/Brand Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🛍️</Text>
          </View>
          <ThemedText style={styles.brandName}>ShopEase</ThemedText>
          <ThemedText style={styles.tagline}>Your Shopping Paradise</ThemedText>
        </View>
        
        <Spacer />
        
        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <ThemedButton 
            onPress={redirectToRegister}
            style={styles.registerButton}
          >
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </ThemedButton>
          
          <ThemedButton 
            onPress={redirectToLogin}
            style={styles.loginButton}
          >
            <ThemedText style={styles.loginButtonText}>I Already Have an Account</ThemedText>
          </ThemedButton>
        </View>
        
        {/* Footer */}
        <ThemedText style={styles.footer}>
          Discover thousands of products at your fingertips
        </ThemedText>
      </View>
    </View>
  )
}

export default splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#667eea',
  },
  // Background gradient layers
  backgroundLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  backgroundLayer2: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#764ba2',
    opacity: 0.7,
  },
  backgroundLayer3: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f093fb',
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    width: '100%',
    zIndex: 1,
  },
  // Decorative circles
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -50,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: '40%',
    left: -30,
  },
  // Logo section
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 60,
  },
  brandName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    letterSpacing: 1,
  },
  // Buttons
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
})
import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import ThemedText from './ThemedText'
import ThemedButton from './ThemedButton'

const CartItem = ({ item, onRemove }) => {
  const imageUrl = item.product.image 
    ? `http://192.168.1.30:9000${item.product.image}` 
    : null

  return (
    <View style={styles.container}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
        />
      )}
      <View style={styles.info}>
        <ThemedText style={styles.name}>{item.product.name}</ThemedText>
        <ThemedText style={styles.price}>${item.product.price}</ThemedText>
        <ThemedText>Quantity: {item.quantity}</ThemedText>
        <ThemedButton
          style={styles.button}
          onPress={() => {
            Alert.alert(
              'Remove Item',
              'Are you sure you want to remove this item?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: onRemove }
              ]
            )
          }}
        >
          <ThemedText style={{ color: '#fff' }}>Remove</ThemedText>
        </ThemedButton>
      </View>
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
  },
  button: {
    marginTop: 5,
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
})
import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Text, RefreshControl, Modal, TextInput, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CartItem from '../../../components/CartItem'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Ionicons } from '@expo/vector-icons'

const API_URL = "http://20.31.0.48:9000/api"

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  
  // Order form fields
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [country, setCountry] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const paymentMethods = ['CASH', 'CARD', 'PAYPAL', 'STRIPE', 'BINANCE']

  useEffect(() => {
    fetchCart()
  }, [])

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setCart(data)
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch cart')
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchCart()
  }

  // Remove item from cart
  const handleRemove = async (productId) => {
    setRemoving(true)
    try {
      const token = await AsyncStorage.getItem('token')
      console.log('Removing product:', productId)
      
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      })
      
      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)
      
      if (res.ok) {
        Alert.alert('Success', 'Item removed from cart')
        setCart(data)
      } else {
        Alert.alert('Error', data.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Remove error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setRemoving(false)
    }
  }

  // Update quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(productId)
      return
    }

    try {
      const token = await AsyncStorage.getItem('token')
      const res = await fetch(`${API_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setCart(data)
      } else {
        Alert.alert('Error', data.message || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Update quantity error:', error)
      Alert.alert('Error', 'Server error')
    }
  }

  // Calculate total price
  const totalPrice = cart
    ? cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    : '0.00'

  // Place order
  const handlePlaceOrder = async () => {
    // Validate form
    if (!street || !city || !zipcode || !country) {
      Alert.alert('Error', 'Please fill in all shipping address fields')
      return
    }

    setPlacingOrder(true)
    try {
      const token = await AsyncStorage.getItem('token')
      
      const orderData = {
        shippingAddress: {
          street,
          city,
          zipcode,
          country
        },
        paymentMethod
      }

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await res.json()

      if (res.ok) {
        Alert.alert('Success', 'Order placed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setShowOrderModal(false)
              // Clear form
              setStreet('')
              setCity('')
              setZipcode('')
              setCountry('')
              setPaymentMethod('CASH')
              // Refresh cart
              fetchCart()
            }
          }
        ])
      } else {
        Alert.alert('Error', data.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Place order error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setPlacingOrder(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading cart...</ThemedText>
      </ThemedView>
    )
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
        <ThemedText style={styles.emptySubtext}>Add some products to get started!</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <CartItem 
            item={item} 
            onRemove={() => handleRemove(item.product._id)}
            onUpdateQuantity={(newQty) => handleUpdateQuantity(item.product._id, newQty)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      />
      
      {/* Cart Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
          <ThemedText style={styles.summaryValue}>${totalPrice}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
          <ThemedText style={styles.summaryValue}>Free</ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <ThemedText style={styles.totalLabel}>Total</ThemedText>
          <ThemedText style={styles.totalValue}>${totalPrice}</ThemedText>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => setShowOrderModal(true)}
        >
          <Text style={styles.checkoutText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Order Modal */}
      <Modal
        visible={showOrderModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Your Order</Text>
                <TouchableOpacity onPress={() => setShowOrderModal(false)}>
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Shipping Address */}
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={street}
                onChangeText={setStreet}
              />
              
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Zip Code"
                value={zipcode}
                onChangeText={setZipcode}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
              />

              {/* Payment Method */}
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <TouchableOpacity 
                style={styles.paymentSelector}
                onPress={() => setShowPaymentModal(true)}
              >
                <Text style={styles.paymentText}>{paymentMethod}</Text>
                <Ionicons name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>

              {/* Order Summary */}
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Items</Text>
                  <Text style={styles.summaryValue}>{cart?.items.length || 0}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryValueBold}>${totalPrice}</Text>
                </View>
              </View>

              {/* Place Order Button */}
              <TouchableOpacity 
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.placeOrderText}>Confirm Order</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.paymentModalOverlay}
          activeOpacity={1}
          onPress={() => setShowPaymentModal(false)}
        >
          <View style={styles.paymentModalContent}>
            <Text style={styles.paymentModalTitle}>Select Payment Method</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={styles.paymentOption}
                onPress={() => {
                  setPaymentMethod(method)
                  setShowPaymentModal(false)
                }}
              >
                <Text style={styles.paymentOptionText}>{method}</Text>
                {paymentMethod === method && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  paymentSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
  },
  summaryBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  placeOrderButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  paymentModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  paymentOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
  },
})
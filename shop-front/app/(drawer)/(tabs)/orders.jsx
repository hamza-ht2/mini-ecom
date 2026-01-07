import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Ionicons } from '@expo/vector-icons'

const API_URL = "http://20.31.0.48:9000/api"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setOrders(data)
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FF9500'
      case 'COMPLETED': return '#34C759'
      case 'SHIPPED': return '#007AFF'
      case 'CANCELLED': return '#FF3B30'
      default: return '#999'
    }
  }

  // Get payment status color
  const getPaymentColor = (status) => {
    switch (status) {
      case 'PAID': return '#34C759'
      case 'PENDING': return '#FF9500'
      case 'FAILED': return '#FF3B30'
      default: return '#999'
    }
  }

  // Render order card
  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.orderId}>Order #{item._id.slice(-6)}</ThemedText>
          <ThemedText style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>{item.status}</ThemedText>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.orderItems}>
        <ThemedText style={styles.itemsTitle}>Items ({item.items.length})</ThemedText>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <ThemedText style={styles.itemName}>• {orderItem.name}</ThemedText>
            <ThemedText style={styles.itemQuantity}>x{orderItem.quantity}</ThemedText>
          </View>
        ))}
        {item.items.length > 2 && (
          <ThemedText style={styles.moreItems}>+{item.items.length - 2} more items</ThemedText>
        )}
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={18} color="#666" />
          <ThemedText style={styles.detailLabel}>Payment:</ThemedText>
          <View style={[styles.paymentBadge, { backgroundColor: getPaymentColor(item.paymentStatus) }]}>
            <ThemedText style={styles.paymentText}>{item.paymentStatus}</ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={18} color="#666" />
          <ThemedText style={styles.detailLabel}>Method:</ThemedText>
          <ThemedText style={styles.detailValue}>{item.paymentMethod}</ThemedText>
        </View>

        {item.shippingAddress && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <ThemedText style={styles.detailLabel}>Address:</ThemedText>
            <ThemedText style={styles.detailValue} numberOfLines={1}>
              {item.shippingAddress.city}, {item.shippingAddress.country}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Order Total */}
      <View style={styles.orderFooter}>
        <ThemedText style={styles.totalLabel}>Total</ThemedText>
        <ThemedText style={styles.totalValue}>${item.total.toFixed(2)}</ThemedText>
      </View>
    </View>
  )

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading orders...</ThemedText>
      </ThemedView>
    )
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Ionicons name="receipt-outline" size={80} color="#ccc" />
        <ThemedText style={styles.emptyText}>No orders yet</ThemedText>
        <ThemedText style={styles.emptySubtext}>Your orders will appear here</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      />
    </ThemedView>
  )
}

export default Orders

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
    padding: 15,
    paddingBottom: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  moreItems: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 4,
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  paymentText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
})
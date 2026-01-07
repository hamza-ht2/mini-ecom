import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, RefreshControl, Modal, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Ionicons } from '@expo/vector-icons'

const API_URL = "http://20.31.0.48:9000/api"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  const orderStatuses = ['PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED']
  const paymentStatuses = ['PENDING', 'PAID', 'FAILED']

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await fetch(`${API_URL}/orders`, {
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

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const updateOrderStatus = async (orderId, status, isPayment = false) => {
    setUpdating(true)
    try {
      const token = await AsyncStorage.getItem('token')
      const body = isPayment ? { paymentStatus: status } : { status }
      
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (res.ok) {
        Alert.alert('Success', `${isPayment ? 'Payment status' : 'Order status'} updated`)
        setShowStatusModal(false)
        setShowPaymentModal(false)
        setShowDetailModal(false)
        fetchOrders()
      } else {
        Alert.alert('Error', data.message || 'Failed to update')
      }
    } catch (error) {
      console.error('Update error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FF9500'
      case 'COMPLETED': return '#34C759'
      case 'SHIPPED': return '#007AFF'
      case 'CANCELLED': return '#FF3B30'
      default: return '#999'
    }
  }

  const getPaymentColor = (status) => {
    switch (status) {
      case 'PAID': return '#34C759'
      case 'PENDING': return '#FF9500'
      case 'FAILED': return '#FF3B30'
      default: return '#999'
    }
  }

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(item)
        setShowDetailModal(true)
      }}
    >
      <View style={styles.orderHeader}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.orderId}>#{item._id.slice(-6)}</ThemedText>
          <ThemedText style={styles.customerName}>
            {item.user?.username || 'Unknown'}
          </ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>{item.status}</ThemedText>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <ThemedText style={styles.infoText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cube-outline" size={16} color="#666" />
          <ThemedText style={styles.infoText}>{item.items.length} items</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <View style={[styles.paymentBadge, { backgroundColor: getPaymentColor(item.paymentStatus) }]}>
            <ThemedText style={styles.paymentBadgeText}>{item.paymentStatus}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <ThemedText style={styles.totalText}>Total: ${item.total.toFixed(2)}</ThemedText>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading orders...</ThemedText>
      </ThemedView>
    )
  }

  if (orders.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Ionicons name="receipt-outline" size={80} color="#ccc" />
        <ThemedText style={styles.emptyText}>No orders yet</ThemedText>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Order Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Order Details</ThemedText>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
              </View>

              {selectedOrder && (
                <>
                  {/* Order Info */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Order #{selectedOrder._id.slice(-6)}</ThemedText>
                    <ThemedText style={styles.detailSubtitle}>
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </ThemedText>
                  </View>

                  {/* Customer Info */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Customer</ThemedText>
                    <ThemedText style={styles.detailText}>
                      {selectedOrder.user?.username || 'Unknown'}
                    </ThemedText>
                    <ThemedText style={styles.detailText}>
                      {selectedOrder.user?.email || 'No email'}
                    </ThemedText>
                  </View>

                  {/* Items */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Items</ThemedText>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                        <ThemedText style={styles.itemQuantity}>x{item.quantity}</ThemedText>
                        <ThemedText style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</ThemedText>
                      </View>
                    ))}
                  </View>

                  {/* Shipping Address */}
                  {selectedOrder.shippingAddress && (
                    <View style={styles.detailSection}>
                      <ThemedText style={styles.sectionTitle}>Shipping Address</ThemedText>
                      <ThemedText style={styles.detailText}>
                        {selectedOrder.shippingAddress.street}
                      </ThemedText>
                      <ThemedText style={styles.detailText}>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipcode}
                      </ThemedText>
                      <ThemedText style={styles.detailText}>
                        {selectedOrder.shippingAddress.country}
                      </ThemedText>
                    </View>
                  )}

                  {/* Payment Info */}
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Payment</ThemedText>
                    <ThemedText style={styles.detailText}>
                      Method: {selectedOrder.paymentMethod}
                    </ThemedText>
                    <View style={[styles.paymentBadge, { backgroundColor: getPaymentColor(selectedOrder.paymentStatus), marginTop: 5 }]}>
                      <ThemedText style={styles.paymentBadgeText}>
                        {selectedOrder.paymentStatus}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Total */}
                  <View style={styles.totalSection}>
                    <ThemedText style={styles.totalLabel}>Total Amount</ThemedText>
                    <ThemedText style={styles.totalAmount}>
                      ${selectedOrder.total.toFixed(2)}
                    </ThemedText>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => setShowStatusModal(true)}
                    >
                      <ThemedText style={styles.updateButtonText}>Update Status</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => setShowPaymentModal(true)}
                    >
                      <ThemedText style={styles.updateButtonText}>Update Payment</ThemedText>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal visible={showStatusModal} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.selectModalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusModal(false)}
        >
          <View style={styles.selectModalContent}>
            <ThemedText style={styles.selectModalTitle}>Update Order Status</ThemedText>
            {orderStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.selectOption}
                onPress={() => updateOrderStatus(selectedOrder._id, status, false)}
                disabled={updating}
              >
                <ThemedText style={styles.selectOptionText}>{status}</ThemedText>
                {selectedOrder?.status === status && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Payment Status Modal */}
      <Modal visible={showPaymentModal} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.selectModalOverlay}
          activeOpacity={1}
          onPress={() => setShowPaymentModal(false)}
        >
          <View style={styles.selectModalContent}>
            <ThemedText style={styles.selectModalTitle}>Update Payment Status</ThemedText>
            {paymentStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.selectOption}
                onPress={() => updateOrderStatus(selectedOrder._id, status, true)}
                disabled={updating}
              >
                <ThemedText style={styles.selectOptionText}>{status}</ThemedText>
                {selectedOrder?.paymentStatus === status && (
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

export default Orders

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
  },
  listContent: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
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
  orderInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  paymentBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
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
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  selectModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  selectOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectOptionText: {
    fontSize: 16,
  },
})
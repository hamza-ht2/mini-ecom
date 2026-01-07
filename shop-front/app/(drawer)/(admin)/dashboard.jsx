import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Ionicons } from '@expo/vector-icons'

const API_URL = "http://20.31.0.48:9000/api"

const Dashboard = () => {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      // Fetch products
      const productsRes = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const products = await productsRes.json()

      // Fetch all orders
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const orders = await ordersRes.json()

      // Calculate stats
      const totalProducts = products.length || 0
      const totalOrders = orders.length || 0
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length || 0
      const completedOrders = orders.filter(o => o.status === 'COMPLETED').length || 0
      const totalRevenue = orders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + o.total, 0) || 0

      setStats({
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      })
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading dashboard...</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Dashboard</ThemedText>
          <ThemedText style={styles.subtitle}>Overview of your store</ThemedText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Total Products */}
          <View style={[styles.statCard, { backgroundColor: '#007AFF' }]}>
            <Ionicons name="pricetag" size={32} color="#fff" />
            <ThemedText style={styles.statValue}>{stats.totalProducts}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Products</ThemedText>
          </View>

          {/* Total Orders */}
          <View style={[styles.statCard, { backgroundColor: '#5856D6' }]}>
            <Ionicons name="receipt" size={32} color="#fff" />
            <ThemedText style={styles.statValue}>{stats.totalOrders}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Orders</ThemedText>
          </View>

          {/* Pending Orders */}
          <View style={[styles.statCard, { backgroundColor: '#FF9500' }]}>
            <Ionicons name="time" size={32} color="#fff" />
            <ThemedText style={styles.statValue}>{stats.pendingOrders}</ThemedText>
            <ThemedText style={styles.statLabel}>Pending Orders</ThemedText>
          </View>

          {/* Completed Orders */}
          <View style={[styles.statCard, { backgroundColor: '#34C759' }]}>
            <Ionicons name="checkmark-circle" size={32} color="#fff" />
            <ThemedText style={styles.statValue}>{stats.completedOrders}</ThemedText>
            <ThemedText style={styles.statLabel}>Completed</ThemedText>
          </View>
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Ionicons name="trending-up" size={40} color="#34C759" />
            <View style={styles.revenueInfo}>
              <ThemedText style={styles.revenueLabel}>Total Revenue</ThemedText>
              <ThemedText style={styles.revenueValue}>
                ${stats.totalRevenue.toFixed(2)}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.revenueNote}>
            From paid orders only
          </ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(drawer)/(admin)/create')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle" size={28} color="#007AFF" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText style={styles.actionTitle}>Create Product</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Add new product to inventory
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(drawer)/(admin)/manage')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="list" size={28} color="#5856D6" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText style={styles.actionTitle}>Manage Products</ThemedText>
              <ThemedText style={styles.actionDescription}>
                View and edit all products
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(drawer)/(admin)/orders')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="clipboard" size={28} color="#FF9500" />
            </View>
            <View style={styles.actionContent}>
              <ThemedText style={styles.actionTitle}>View Orders</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Manage customer orders
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  revenueInfo: {
    marginLeft: 15,
    flex: 1,
  },
  revenueLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34C759',
  },
  revenueNote: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  actionDescription: {
    fontSize: 13,
    color: '#666',
  },
})
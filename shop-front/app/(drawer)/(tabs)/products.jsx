import { View, FlatList, Alert, StyleSheet, Text, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProductCard from '../../../components/ProductCard'
import SearchBar from '../../../components/SearchBar'
import ThemedView from '../../../components/ThemedView'

const API_URL = "http://20.31.0.48:9000/api" 

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setProducts(data)
        setFilteredProducts(data)
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Server error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts()
  }

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      })
      const data = await res.json()
      
      if (res.ok) {
        Alert.alert('Success', 'Added to cart!')
      } else {
        Alert.alert('Error', data.message || 'Failed to add to cart')
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Server error')
    }
  }

  // Search products
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredProducts(products)
      return
    }
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProducts(filtered)
  }

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </ThemedView>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text style={styles.emptyText}>No products available</Text>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch}
          placeholder="Search products..."
        />
      </View>
      
      {filteredProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard
              name={item.name}
              price={item.price}
              image={item.image ? `http://20.31.0.48:9000${item.image}` : null}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
        />
      )}
    </ThemedView>
  )
}

export default Products

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  searchContainer: {
    marginTop: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
})
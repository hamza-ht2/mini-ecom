import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image, RefreshControl, Modal, TextInput, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Ionicons } from '@expo/vector-icons'

const API_URL = "http://20.31.0.48:9000/api"

const Manage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  const categories = ['electronics', 'clothing', 'food', 'books', 'home', 'sports', 'other']

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    handleSearch(searchQuery)
  }, [products, searchQuery])

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
      console.error('Fetch products error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts()
  }

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

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product)
    setEditName(product.name)
    setEditPrice(product.price.toString())
    setEditDescription(product.description)
    setEditCategory(product.category)
    setEditImage(null)
    setShowEditModal(true)
  }

  // Pick new image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      setEditImage(result.assets[0])
    }
  }

  // Update product
  const handleUpdate = async () => {
    if (!editName || !editPrice || !editDescription) {
      Alert.alert('Error', 'Please fill all fields')
      return
    }

    if (isNaN(editPrice) || parseFloat(editPrice) <= 0) {
      Alert.alert('Error', 'Please enter valid price')
      return
    }

    setUpdating(true)
    try {
      const token = await AsyncStorage.getItem('token')
      const formData = new FormData()
      
      formData.append('name', editName)
      formData.append('price', parseFloat(editPrice))
      formData.append('description', editDescription)
      formData.append('category', editCategory)

      if (editImage) {
        const imageName = editImage.uri.split('/').pop()
        const imageType = `image/${imageName.split('.').pop()}`
        formData.append('image', {
          uri: editImage.uri,
          name: imageName,
          type: imageType,
        })
      }

      const res = await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        Alert.alert('Success', 'Product updated successfully!')
        setShowEditModal(false)
        fetchProducts()
      } else {
        Alert.alert('Error', data.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Update error:', error)
      Alert.alert('Error', 'Server error')
    } finally {
      setUpdating(false)
    }
  }

  // Delete product
  const handleDelete = async (productId, productName) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token')
              const res = await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              })

              if (res.ok) {
                Alert.alert('Success', 'Product deleted successfully')
                fetchProducts()
              } else {
                const data = await res.json()
                Alert.alert('Error', data.message || 'Failed to delete product')
              }
            } catch (error) {
              console.error('Delete error:', error)
              Alert.alert('Error', 'Server error')
            }
          }
        }
      ]
    )
  }

  const renderProduct = ({ item }) => {
    const imageUrl = item.image ? `http://20.31.0.48:9000${item.image}` : null

    return (
      <View style={styles.productCard}>
        <View style={styles.productContent}>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          )}
          <View style={styles.productInfo}>
            <ThemedText style={styles.productName}>{item.name}</ThemedText>
            <ThemedText style={styles.productPrice}>${item.price}</ThemedText>
            <View style={styles.categoryBadge}>
              <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.productActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item._id, item.name)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Products Count */}
      <View style={styles.countContainer}>
        <ThemedText style={styles.countText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </ThemedText>
      </View>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cube-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyText}>No products found</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Edit Product Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Edit Product</ThemedText>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Product Name */}
              <ThemedText style={styles.label}>Product Name *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                value={editName}
                onChangeText={setEditName}
              />

              {/* Price */}
              <ThemedText style={styles.label}>Price *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="decimal-pad"
              />

              {/* Description */}
              <ThemedText style={styles.label}>Description *</ThemedText>
              <TextInput
                style={styles.textArea}
                placeholder="Enter description"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={4}
              />

              {/* Category */}
              <ThemedText style={styles.label}>Category *</ThemedText>
              <TouchableOpacity 
                style={styles.categorySelector}
                onPress={() => setShowCategoryModal(true)}
              >
                <ThemedText>{editCategory.charAt(0).toUpperCase() + editCategory.slice(1)}</ThemedText>
                <Ionicons name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>

              {/* Current Image */}
              {editingProduct?.image && !editImage && (
                <View style={styles.currentImageContainer}>
                  <ThemedText style={styles.label}>Current Image</ThemedText>
                  <Image 
                    source={{ uri: `http://20.31.0.48:9000${editingProduct.image}` }} 
                    style={styles.currentImage} 
                  />
                </View>
              )}

              {/* New Image */}
              <ThemedText style={styles.label}>Change Image (Optional)</ThemedText>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="image" size={24} color="#007AFF" />
                <ThemedText style={styles.imageButtonText}>Pick New Image</ThemedText>
              </TouchableOpacity>

              {editImage && (
                <View style={styles.newImageContainer}>
                  <Image source={{ uri: editImage.uri }} style={styles.newImage} />
                  <TouchableOpacity onPress={() => setEditImage(null)}>
                    <ThemedText style={styles.removeText}>Remove</ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              {/* Update Button */}
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.updateButtonText}>Update Product</ThemedText>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.categoryModalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.categoryModalContent}>
            <ThemedText style={styles.categoryModalTitle}>Select Category</ThemedText>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryOption}
                  onPress={() => {
                    setEditCategory(item)
                    setShowCategoryModal(false)
                  }}
                >
                  <ThemedText style={styles.categoryOptionText}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </ThemedText>
                  {editCategory === item && <Ionicons name="checkmark" size={24} color="#007AFF" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  )
}

export default Manage

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
  searchContainer: {
    padding: 15,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  countContainer: {
    padding: 15,
    paddingBottom: 5,
  },
  countText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
    paddingTop: 5,
  },
  productCard: {
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
  productContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  categorySelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentImageContainer: {
    marginBottom: 15,
  },
  currentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 16,
  },
  newImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  newImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeText: {
    color: '#FF3B30',
    marginTop: 10,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryOptionText: {
    fontSize: 16,
  },
})
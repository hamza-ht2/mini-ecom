import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, StyleSheet, ActivityIndicator, Modal, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemedView from '../../../components/ThemedView'

const API_URL = "http://20.31.0.48:9000/api"

const Create = () => {
  // Form states
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [image, setImage] = useState(null)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const categories = ['electronics', 'clothing', 'food', 'books', 'home', 'sports', 'other']

  // Check token on component load
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token')
      const role = await AsyncStorage.getItem('role')
      console.log('Stored token:', token)
      console.log('Stored role:', role)
    }
    checkToken()
  }, [])

  // Pick image from phone gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  // Take photo with camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  // Create product and send to backend
  const createProduct = async () => {
    // Check if all fields are filled
    if (!name || !price || !description) {
      Alert.alert('Error', 'Please fill all fields')
      return
    }

    // Check if price is valid number
    if (isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter valid price')
      return
    }

    setLoading(true)

    try {
      // Get user token
      const token = await AsyncStorage.getItem('token')
      console.log('Token:', token)

      // Prepare form data
      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', parseFloat(price))
      formData.append('description', description)
      formData.append('category', category)

      // Add image if selected
      if (image) {
        const imageName = image.uri.split('/').pop()
        const imageType = `image/${imageName.split('.').pop()}`
        formData.append('image', {
          uri: image.uri,
          name: imageName,
          type: imageType,
        })
      }

      // Send to backend
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      // Get response as text first
      const responseText = await response.text()
      console.log('Response:', responseText)

      // Try to parse JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Parse error:', e)
        Alert.alert('Error', 'Server error: ' + responseText.substring(0, 100))
        return
      }

      if (response.ok) {
        Alert.alert('Success', 'Product created!')
        // Clear form
        setName('')
        setPrice('')
        setDescription('')
        setCategory('other')
        setImage(null)
      } else {
        Alert.alert('Error', data.message || 'Failed to create product')
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Create New Product</Text>

        {/* Product Name */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={name}
          onChangeText={setName}
        />

        {/* Price */}
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          <Text>▼</Text>
        </TouchableOpacity>

        {/* Image */}
        <Text style={styles.label}>Product Image</Text>
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
            <Text style={styles.imageBtnText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={createProduct}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Create Product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.modalBg}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(item)
                    setShowCategoryModal(false)
                  }}
                >
                  <Text>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                  {category === item && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  imageBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 15,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  check: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
})
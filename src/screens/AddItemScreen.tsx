import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import { addProduct, presignImageUpload } from '../api/endpoints';

export default function AddproductScreen({ navigation }: any) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const pickImageNative = async () => {
  //   try {
  //     // Request permission if needed
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission Denied', 'We need camera roll permission to select images');
  //       return;
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled) {
  //       setSelectedImageUri(result.assets[0].uri);
  //     }
  //   } catch (err: any) {
  //     Alert.alert('Image Picker Error', err.message);
  //   }
  // };

  const pickImageWeb = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImageUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const pickImage = Platform.OS === 'web' ? pickImageWeb : pickImageNative;
  const pickImage =  pickImageWeb ;

  const uploadImage = async (): Promise<string> => {
    if (!selectedImageUri) return '';

    try {
      setUploading(true);
      const contentType = 'image/jpeg';

      // Step 1: Get presigned URL
      const presignResult = await presignImageUpload(contentType);
      const { uploadUrl, key } = presignResult;

      // Step 2: Upload image to S3
      const imageData = await fetch(selectedImageUri);
      const blob = await imageData.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      return key;
    } catch (err: any) {
      Alert.alert('Image Upload Failed', err.message);
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!productName || !productPrice) {
      Alert.alert('Missing info', 'product name and price are required');
      return;
    }
    setSaving(true);
    try {
      let productImgUri: string  = '';
      
      if (selectedImageUri) {
        productImgUri = await uploadImage();
        if (!productImgUri) {
          // Image upload failed, user was already alerted
          return;
        }
      }

      await addProduct({ productName, productPrice: Number(productPrice), productDescription, productImgUri });
      Alert.alert('Added', `${productName} added to your products`);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Failed to add product', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add product</Text>
      <TextInput style={styles.input} placeholder="product name" value={productName} onChangeText={setProductName} />
      <TextInput style={styles.input} placeholder="Price" keyboardType="decimal-pad" value={productPrice} onChangeText={setProductPrice} />
      <TextInput style={styles.input} placeholder="Description" value={productDescription} onChangeText={setProductDescription} multiline />
      
      <Pressable style={styles.imageButton} onPress={pickImage} disabled={uploading || saving}>
        <Text style={styles.imageButtonText}>📷 Choose Image</Text>
      </Pressable>

      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      )}

      {selectedImageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />
          {uploading && <ActivityIndicator size="large" color="#1d9e75" style={styles.uploadIndicator} />}
        </View>
      )}

      <Pressable style={styles.button} onPress={handleSave} disabled={saving || uploading}>
        <Text style={styles.buttonText}>{saving || uploading ? 'Saving...' : 'Save product'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  imageButton: { backgroundColor: '#e8f5f0', borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1d9e75' },
  imageButtonText: { color: '#1d9e75', fontSize: 16, fontWeight: '600' },
  imagePreviewContainer: { position: 'relative', borderRadius: 8, overflow: 'hidden', backgroundColor: '#f5f5f5' },
  imagePreview: { width: '100%', height: 200 },
  uploadIndicator: { position: 'absolute', top: '50%', left: '50%', marginTop: -25, marginLeft: -25 },
  button: { backgroundColor: '#1d9e75', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

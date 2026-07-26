import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { listProducts, productImageUrl } from '../api/endpoints';
import { Product } from '../types';

export default function ProductScreen({ navigation }: any) {
  const { ownerId } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setRefreshing(true);
    try {
      setProducts(await listProducts(ownerId));
    } finally {
      setRefreshing(false);
    }
  }, [ownerId]);

  // Reload every time this screen comes into focus, e.g. after adding an item.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No products yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {!!item.productImgUri && (
              <Image source={{ uri: productImageUrl(item.productImgUri) }} style={styles.itemImage} />
            )}
            <Text style={styles.itemName}>{item.productName}</Text>
            <Text style={styles.itemPrice}>₹{item.productPrice}</Text>
            {!!item.productDescription && <Text style={styles.itemDesc}>{item.productDescription}</Text>}
          </View>
        )}
      />
      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddItem')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { textAlign: 'center', marginTop: 48, color: '#888' },
  card: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { fontSize: 14, color: '#1d9e75', marginTop: 4 },
  itemDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1d9e75',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
  itemImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
});

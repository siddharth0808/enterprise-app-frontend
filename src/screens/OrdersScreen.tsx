import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { listOrders, updateOrderStatus } from '../api/endpoints';
import { Order, OrderStatus } from '../types';

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  PLACED: 'PREPARING',
  PREPARING: 'SHIPPED',
  SHIPPED: null,
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  SHIPPED: 'Shipped',
};

export default function OrdersScreen() {
  const { ownerId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    setRefreshing(true);
    try {
      setOrders(await listOrders(ownerId));
    } finally {
      setRefreshing(false);
    }
  }, [ownerId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const advanceStatus = async (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next || !ownerId) return;
    await updateOrderStatus(ownerId, order.orderId, next);
    load();
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.orderId}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.customer}>{item.customerName || item.customerPhone}</Text>
            <Text style={styles.status}>{STATUS_LABEL[item.status]}</Text>
          </View>
          <Text style={styles.total}>Total: ₹{item.total}</Text>
          {item.products.map((line) => (
            <Text key={line.productId} style={styles.line}>
              {line.quantity} × {line.productName}
            </Text>
          ))}
          {NEXT_STATUS[item.status] && (
            <Pressable style={styles.button} onPress={() => advanceStatus(item)}>
              <Text style={styles.buttonText}>Mark as {STATUS_LABEL[NEXT_STATUS[item.status]!]}</Text>
            </Pressable>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 48, color: '#888' },
  card: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  customer: { fontSize: 16, fontWeight: '600' },
  status: { fontSize: 13, color: '#1d9e75', fontWeight: '600' },
  total: { fontSize: 14, marginTop: 4 },
  line: { fontSize: 13, color: '#666' },
  button: { backgroundColor: '#1d9e75', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

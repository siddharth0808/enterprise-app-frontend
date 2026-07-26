import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ProductScreen from '../screens/ProductScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AddItemScreen from '../screens/AddItemScreen';
import { useAuth } from '../auth/AuthContext';

const Drawer = createDrawerNavigator();
const ProductsStack = createNativeStackNavigator();

function ProductsStackScreen() {
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen name="ProductsList" component={ProductScreen} options={{ title: 'Products' }} />
      <ProductsStack.Screen name="AddProduct" component={AddItemScreen} options={{ title: 'Add product' }} />
    </ProductsStack.Navigator>
  );
}

function LogoutScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.logoutContainer}>
      <Text style={styles.logoutText}>Log out of your canteen account?</Text>
      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

export default function OwnerDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Products">
      <Drawer.Screen name="Products" component={ProductsStackScreen} />
      <Drawer.Screen name="Orders" component={OrdersScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24 },
  logoutText: { fontSize: 16 },
  logoutButton: { backgroundColor: '#d85a30', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  logoutButtonText: { color: '#fff', fontWeight: '600' },
});

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import * as CognitoAuth from '../auth/CognitoAuth';
import { registerOwner } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [fields, setFields] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');

  const set = (key: keyof typeof fields) => (value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const { businessName, ownerName, email, phone, address, password, confirmPassword } = fields;
    if (!businessName || !ownerName || !email || !phone || !address || !password) {
      Alert.alert('Missing info', 'Please fill in every field');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please re-enter your password');
      return;
    }

    try {
      await CognitoAuth.signUp({ phoneNumber: phone, email, password, fullName: ownerName, role: 'owner' });
      setStep('confirm');
    } catch (err: any) {
      Alert.alert('Registration failed', err.message ?? 'Something went wrong');
    }
  };

  const handleConfirm = async () => {
    try {
      await CognitoAuth.confirmSignUp(fields.email, code);
      await signIn(fields.email, fields.password);
      // Now that we have a JWT, write the canteen profile row.
      await registerOwner({
        businessName: fields.businessName,
        ownerName: fields.ownerName,
        email: fields.email,
        businessAddress: fields.address,
        ownerMobile: fields.phone,
      });
      Alert.alert('Registered!', 'Your canteen account is ready.');
    } catch (err: any) {
      Alert.alert('Confirmation failed', err.message ?? 'Invalid code');
    }
  };

  if (step === 'confirm') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter confirmation code</Text>
        <Text style={styles.subtitle}>Sent via SMS to {fields.phone}</Text>
        <TextInput style={styles.input} placeholder="Code" keyboardType="number-pad" value={code} onChangeText={setCode} />
        <Pressable style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register your canteen</Text>
      <TextInput style={styles.input} placeholder="Business name" value={fields.businessName} onChangeText={set('businessName')} />
      <TextInput style={styles.input} placeholder="Your name" value={fields.ownerName} onChangeText={set('ownerName')} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={fields.email} onChangeText={set('email')} />
      <TextInput style={styles.input} placeholder="Phone number (+91...)" keyboardType="phone-pad" value={fields.phone} onChangeText={set('phone')} />
      <TextInput style={styles.input} placeholder="Business address" value={fields.address} onChangeText={set('address')} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={fields.password} onChangeText={set('password')} />
      <TextInput style={styles.input} placeholder="Confirm password" secureTextEntry value={fields.confirmPassword} onChangeText={set('confirmPassword')} />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#1d9e75', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 16, color: '#1d9e75' },
});

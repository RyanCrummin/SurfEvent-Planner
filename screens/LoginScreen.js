import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { surfingTheme } from '../lib/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    else navigation.replace('EventList');
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="wave" size={80} color={surfingTheme.colors.primary} />
      <Text style={styles.title}>SurfSlots Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Login
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Signup')} textColor={surfingTheme.colors.secondary}>
        Create Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfingTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginVertical: 20,
    color: surfingTheme.colors.primary,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: surfingTheme.colors.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: surfingTheme.colors.primary,
    marginVertical: 10,
    width: '100%',
    padding: 5,
  },
});

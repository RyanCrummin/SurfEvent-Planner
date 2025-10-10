import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { surfingTheme } from '../lib/theme';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Error', error.message);
    else {
      await supabase.from('profiles').insert([{ id: data.user.id, full_name: fullName }]);
      Alert.alert('Success', 'Account created! Please login.');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="surfing" size={80} color={surfingTheme.colors.primary} />
      <Text style={styles.title}>SurfSlots Signup</Text>

      <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Button mode="contained" onPress={handleSignup} style={styles.signupButton}>
        Create Account
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()} textColor={surfingTheme.colors.secondary}>
        Back to Login
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
  signupButton: {
    backgroundColor: surfingTheme.colors.primary,
    marginVertical: 10,
    width: '100%',
    padding: 5,
  },
});

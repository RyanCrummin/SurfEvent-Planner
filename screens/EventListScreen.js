import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';


export default function EventListScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fetch events from Supabase
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('starts_at');
    if (error) console.log(error.message);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // Optional: add real-time updates if you want
    const channel = supabase
      .channel('events-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Admin login handler
  const handleLogin = () => {
    if (password === 'surfadmin2025') {
      setPassword('');
      setError('');
      navigation.navigate('AdminPanel');
    } else {
      setError('Incorrect password 🌊');
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Existing Event List --- */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>Starts: {new Date(item.starts_at).toLocaleString()}</Text>
            <Text>Slots: {item.max_slots}</Text>
          </View>
        )}
      />

      {/* --- Admin Panel Button & Inline Login --- */}
      {!showLogin && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => setShowLogin(true)}
        >
          <Text style={styles.adminButtonText}>Admin Panel 🌊</Text>
        </TouchableOpacity>
      )}

      {showLogin && (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Admin Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
            <Text style={styles.submitButtonText}>Enter 🌊</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowLogin(false); setError(''); setPassword(''); }}>
            <Text style={styles.cancelText}>Cancel ❌</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  eventCard: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: { fontWeight: 'bold', fontSize: 16 },
  adminButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  adminButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loginContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#00BFFF20', // semi-transparent ocean blue
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#87CEFA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: { color: 'white', fontWeight: 'bold' },
  cancelText: { textAlign: 'center', color: '#333', marginTop: 5 },
  errorText: { color: 'red', marginBottom: 8, textAlign: 'center' },
});

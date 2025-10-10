import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';
import { surfingTheme } from '../lib/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [slots, setSlots] = useState([]);

  // Fetch slots from Supabase
  const fetchSlots = async () => {
    const { data } = await supabase
      .from('event_slots')
      .select('*')
      .eq('event_id', eventId)
      .order('slot_index');
    setSlots(data);
  };

  // Real-time subscription
  useEffect(() => {
    fetchSlots();
    const subscription = supabase
      .from(`event_slots:event_id=eq.${eventId}`)
      .on('*', fetchSlots)
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, []);

  // Join / Open slot
  const handleJoin = async (slotId) => {
    const user = supabase.auth.user();
    await supabase
      .from('event_slots')
      .update({ profile_id: user.id, status: 'TAKEN' })
      .eq('id', slotId);
  };

  const handleOpen = async (slotId) => {
    await supabase
      .from('event_slots')
      .update({ profile_id: null, status: 'OPEN' })
      .eq('id', slotId);
  };

  // Split taken vs open slots
  const takenSlots = slots.filter(s => s.status === 'TAKEN');
  const openSlots = slots.filter(s => s.status === 'OPEN');

  // Animated card rendering
  const renderSlot = (item, type) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <TouchableWithoutFeedback
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => {
          scale.value = withSpring(1);
          type === 'open' ? handleJoin(item.id) : handleOpen(item.id);
        }}
      >
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <Card style={[styles.card, { backgroundColor: type === 'taken' ? surfingTheme.colors.participant : surfingTheme.colors.openSlot }]}>
            <Card.Title
              title={type === 'taken' ? item.profile_id : `Slot ${item.slot_index}`}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name={type === 'taken' ? 'account' : 'surfing'}
                  size={24}
                  color="white"
                />
              )}
            />
          </Card>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <LinearGradient
      colors={['#00BFFF', '#87CEFA', '#F0E68C']}
      style={styles.container}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Participants */}
        <View style={{ flex: 1, marginRight: 5 }}>
          <Text style={[styles.header, { color: surfingTheme.colors.participant }]}>Participants</Text>
          <FlatList
            data={takenSlots}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderSlot(item, 'taken')}
          />
        </View>

        {/* Open Slots */}
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text style={[styles.header, { color: surfingTheme.colors.openSlot }]}>Open Slots</Text>
          <FlatList
            data={openSlots}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderSlot(item, 'open')}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
  cardContainer: { marginBottom: 10 },
  card: { elevation: 4, borderRadius: 10 },
});

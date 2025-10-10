import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { surfingTheme } from './theme';
import { TextField, Button, Card, CardContent, Typography, IconButton, Divider } from '@mui/material';
import SurfingIcon from '@mui/icons-material/Surfing';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [maxSlots, setMaxSlots] = useState(5);
  const [startsAt, setStartsAt] = useState('');
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch events from Supabase
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('starts_at');
    if (error) console.log(error.message);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();

    // Real-time updates
    const channel = supabase
      .channel('events-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Create or update event
  const handleCreate = async () => {
    if (!title || !startsAt || !maxSlots) return alert('Fill all fields!');

    if (editingEvent) {
      // Update
      const { error } = await supabase
        .from('events')
        .update({ title, max_slots: maxSlots, starts_at: startsAt })
        .eq('id', editingEvent.id);
      if (error) return alert(error.message);
      setEditingEvent(null);
    } else {
      // Create
      const { data: event, error } = await supabase
        .from('events')
        .insert([{ title, max_slots: maxSlots, starts_at: startsAt }])
        .select()
        .single();
      if (error) return alert(error.message);

      // Generate empty slots
      const slots = Array.from({ length: maxSlots }).map((_, i) => ({
        event_id: event.id,
        slot_index: i + 1,
        status: 'OPEN',
        profile_id: null,
      }));
      const { error: slotsError } = await supabase.from('event_slots').insert(slots);
      if (slotsError) return alert(slotsError.message);
    }

    alert(editingEvent ? 'Event updated!' : 'Event created! 🌊');
    setTitle('');
    setMaxSlots(5);
    setStartsAt('');
    fetchEvents();
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await supabase.from('event_slots').delete().eq('event_id', id);
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  // Edit event
  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setMaxSlots(event.max_slots);
    setStartsAt(event.starts_at);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00BFFF, #87CEFA, #F0E68C)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
      }}
    >
      {/* Event Form */}
      <Card sx={{ width: 400, p: 3, borderRadius: 3, boxShadow: 6, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SurfingIcon /> {editingEvent ? 'Edit Surf Event' : 'Create Surf Event'}
          </Typography>
          <TextField
            fullWidth
            label="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Max Slots"
            value={maxSlots}
            onChange={(e) => setMaxSlots(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Starts At"
            InputLabelProps={{ shrink: true }}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreate}
            sx={{
              backgroundColor: surfingTheme.colors.secondary,
              '&:hover': { backgroundColor: '#FF4500' },
              color: surfingTheme.colors.buttonText,
            }}
          >
            {editingEvent ? 'Update Event 🌊' : 'Create Event 🌊'}
          </Button>
        </CardContent>
      </Card>

      {/* Event List */}
      <Box sx={{ width: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Existing Events
        </Typography>
        {events.map((event) => (
          <Card key={event.id} sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">{event.title}</Typography>
                <Typography variant="body2">Starts: {new Date(event.starts_at).toLocaleString()}</Typography>
                <Typography variant="body2">Slots: {event.max_slots}</Typography>
              </Box>
              <Box>
                <IconButton color="primary" onClick={() => handleEdit(event)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(event.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && <Typography>No events yet 🌊</Typography>}
      </Box>
    </Box>
  );
}

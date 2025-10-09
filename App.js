import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { supabase } from './lib/supabaseClient'
import {SUPABASE_URL} from '@env'

console.log('Supabase URL from .env:', SUPABASE_URL)
export default function App() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('events').select('*')
      if (error) console.log('❌ Supabase error:', error)
      else console.log('✅ Connected! Events:', data)
    }
    testConnection()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>SurfSlots App Ready 🌊</Text>
    </View>
  )
}

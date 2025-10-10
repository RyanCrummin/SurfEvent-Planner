import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AdminPanelScreen() {
    if(Platform.OS === 'web') {
        return <View><Text>Admin Panel is not available on web.</Text></View>;
    }   
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://your-admin-dashboard-url.com' }} // Deploy dashboard to Vercel/Netlify
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
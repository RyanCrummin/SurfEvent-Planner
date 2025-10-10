import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { surfingTheme } from './lib/theme';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import EventListScreen from './screens/EventListScreen';
import EventDetailScreen from './screens/EventDetailsScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import 'react-native-gesture-handler';
import 'react-native-reanimated';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={surfingTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="EventList" component={EventListScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

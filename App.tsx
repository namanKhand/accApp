import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/theme';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { registerForPushNotificationsAsync } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    // Request notification permissions on app start
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        console.log('Notification token registered:', token);
        // Token will be saved to user profile in AppContext
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppProvider>
            <RootNavigator />
          </AppProvider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

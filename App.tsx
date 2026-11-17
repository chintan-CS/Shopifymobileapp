import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator, navigationTheme } from './src/navigation';
import { getStatusBarStyle, theme } from './src/theme';
import { CartProvider } from './src/features/cart';

export default function App(): React.JSX.Element {
  const initialStatusBarStyle = getStatusBarStyle(theme.colors.background);

  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar barStyle={initialStatusBarStyle} />
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

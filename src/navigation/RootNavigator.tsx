import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { getNavigationStatusBarStyle, theme } from '../theme';
import { WelcomeScreen } from '../features/welcome';
import { HomeScreen, ProductDetailsScreen } from '../features/catalog';
import { CartScreen } from '../features/cart';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const headerStatusBarStyle = getNavigationStatusBarStyle(theme.colors.surface);
  const backgroundStatusBarStyle = getNavigationStatusBarStyle(
    theme.colors.background,
  );

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        statusBarStyle: headerStatusBarStyle,
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
          statusBarStyle: backgroundStatusBarStyle,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          statusBarStyle: backgroundStatusBarStyle,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: 'Details',
          statusBarStyle: headerStatusBarStyle,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Shopping Cart',
          statusBarStyle: headerStatusBarStyle,
        }}
      />
    </Stack.Navigator>
  );
};

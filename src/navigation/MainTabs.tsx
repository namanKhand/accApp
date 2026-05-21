import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

export type TabParamList = {
  Friends: undefined;
  Me: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Me"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.surface,
          height: 84,
          paddingBottom: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          borderColor: colors.glassBorder,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.15,
          shadowRadius: 18,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused }) => {
          const iconMap: Record<keyof TabParamList, string> = {
            Friends: 'account-group',
            Me: 'home',
            Settings: 'cog',
          };
          const iconName = iconMap[route.name as keyof TabParamList];
          return (
            <MaterialCommunityIcons
              name={iconName as any}
              color={focused ? colors.primary : colors.secondary}
              size={28}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Friends" component={FriendsScreen} options={{ tabBarLabel: 'FRIENDS' }} />
      <Tab.Screen
        name="Me"
        component={HomeScreen}
        options={{
          tabBarLabel: 'ME',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={30}
              color={focused ? colors.primary : colors.secondary}
            />
          ),
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
};

export default MainTabs;

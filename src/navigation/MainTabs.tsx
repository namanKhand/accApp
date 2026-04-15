import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../constants/colors';

export type TabParamList = {
  Friends: undefined;
  Me: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Me"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.text,
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.4)',
        height: 84,
        paddingBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.45)',
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 12,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.text,
      },
      tabBarIcon: ({ color, size, focused }) => {
        const iconMap: Record<keyof TabParamList, string> = {
          Friends: 'account-group',
          Me: 'home',
          Settings: 'cog',
        };
        const iconName = iconMap[route.name as keyof TabParamList];

        // Highlight active tab with a circle or different style if needed
        // For now just changing color/size
        return <MaterialCommunityIcons name={iconName as any} color={focused ? COLORS.primary : COLORS.text} size={28} />;
      }
    })}
  >
    <Tab.Screen
      name="Friends"
      component={FriendsScreen}
      options={{ tabBarLabel: 'FRIENDS' }}
    />
    <Tab.Screen
      name="Me"
      component={HomeScreen}
      options={{ tabBarLabel: 'ME' }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ tabBarLabel: 'Settings' }}
    />
  </Tab.Navigator>
);

export default MainTabs;

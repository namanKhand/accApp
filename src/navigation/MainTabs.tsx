import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CheckInScreen from '../screens/CheckInScreen';
import StreaksScreen from '../screens/StreaksScreen';
import NudgeScreen from '../screens/NudgeScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
  Home: undefined;
  CheckIn: undefined;
  Streaks: undefined;
  Nudges: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#C46B3B',
      tabBarInactiveTintColor: '#6F6F6F',
      tabBarIcon: ({ color, size }) => {
        const iconMap: Record<keyof TabParamList, string> = {
          Home: 'home-heart',
          CheckIn: 'camera',
          Streaks: 'fire',
          Nudges: 'bell-ring',
          Profile: 'account-circle'
        };
        const iconName = iconMap[route.name as keyof TabParamList] || 'circle';
        return <MaterialCommunityIcons name={iconName as any} color={color} size={size} />;
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="CheckIn" component={CheckInScreen} />
    <Tab.Screen name="Streaks" component={StreaksScreen} />
    <Tab.Screen name="Nudges" component={NudgeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabs;

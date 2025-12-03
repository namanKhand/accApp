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
        backgroundColor: COLORS.primary,
        height: 80,
        paddingBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        return <MaterialCommunityIcons name={iconName as any} color={focused ? COLORS.text : COLORS.text} size={30} />;
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
      options={{
        tabBarLabel: 'ME',
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons name="home-outline" size={30} color={COLORS.text} />
        )
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ tabBarLabel: 'Settings' }}
    />
  </Tab.Navigator>
);

export default MainTabs;

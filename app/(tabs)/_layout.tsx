import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../src/constants/Colors';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: Colors.blue,
      tabBarInactiveTintColor: Colors.gray,
      headerShown: false, 
      tabBarStyle: {
        height: hp(13),
        paddingBottom: hp(5),
      }
    }}>
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Événements',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: 'Mes participations',
          tabBarIcon: ({ color }) => <Ionicons name="ticket" size={24} color={color} />,
        }}
      />
      
    </Tabs>
  );
}
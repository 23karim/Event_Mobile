import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../src/constants/Colors';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: Colors.blue,
      tabBarInactiveTintColor: Colors.gray,
      headerShown: false, // On cache le header par défaut pour utiliser le nôtre
      tabBarStyle: {
        height: hp(13),
        paddingBottom: hp(5),
      }
    }}>
      <Tabs.Screen
        name="index" // Correspond à app/(tabs)/index.tsx (Liste des events)
        options={{
          title: 'Événements',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-events" // Futur fichier app/(tabs)/my-events.tsx
        options={{
          title: 'Mes participations',
          tabBarIcon: ({ color }) => <Ionicons name="ticket" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // Futur fichier app/(tabs)/profile.tsx
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
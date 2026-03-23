import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '../../src/constants/Colors';
import { EventCard } from '../../src/components/EventCard';
import { SearchBar } from '../../src/components/SearchBar';

import { Event } from '../../src/models/event';
import { eventService } from '../../src/services/eventService';
import { useAuth } from '../../src/context/AuthContext'; 

export default function EventsListScreen() {
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  const { signOut } = useAuth(); 

  const loadEvents = async () => {
    try {
      const response = await eventService.getAllEvents(1, 50);
      setEvents(response.events);
    } catch (error) {
      console.error("Erreur chargement events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Oui", onPress: () => signOut() }
      ]
    );
  };

  const isEventPast = (startDate: string) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    return eventDate < now;
  };

  const handleParticipate = async (event: Event) => {
    if (isEventPast(event.date_debut)) {
      Alert.alert("Action impossible", "Cet événement a déjà commencé ou est terminé.");
      return;
    }

    try {
      const response = await eventService.joinEvent(event.id);
      Alert.alert("Félicitations", response.message);
      loadEvents(); 
    } catch (error: any) {
      if (error.includes("déjà")) {
        confirmLeave(event.id);
      } else {
        Alert.alert("Information", error);
      }
    }
  };

  const confirmLeave = (eventId: number) => {
    Alert.alert(
      "Déjà inscrit",
      "Vous participez déjà à cet événement. Voulez-vous annuler votre participation ?",
      [
        { text: "Non", style: "cancel" },
        { text: "Oui, annuler", style: "destructive", onPress: () => handleLeave(eventId) }
      ]
    );
  };

  const handleLeave = async (eventId: number) => {
    try {
      const response = await eventService.leaveEvent(eventId);
      Alert.alert("Annulé", response.message);
      loadEvents(); 
    } catch (error: any) {
      Alert.alert("Erreur", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const filteredEvents = events.filter(event => {
    const term = search.toLowerCase().trim();
    return (
      event.titre.toLowerCase().includes(term) || 
      event.lieu.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Trouvez des événements</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
        
        <SearchBar
          value={search} 
          onChangeText={setSearch} 
          placeholder="Chercher par lieu ou titre..." 
          onFilterPress={() => console.log("Open Filter Modal")}
        />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={Colors.blue} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.blue]} />
          }
          renderItem={({ item }) => (
            <EventCard 
              title={item.titre}
              description={item.description || "Aucune description disponible"}
              startDate={formatDate(item.date_debut)}
              endDate={formatDate(item.date_fin)}
              location={item.lieu}
              price={item.prix.toString()}
              image={item.image || ''}
              participants={Number(item.participants_count) || 0} 
              onParticipate={() => handleParticipate(item)}
              onPress={() => router.push({
                  pathname: "/event-details/[id]", 
                  params: { id: item.id }
              })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {search ? "Aucun résultat pour cette recherche." : "Aucun événement disponible."}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingHorizontal: wp(5), 
    paddingTop: hp(6), 
    paddingBottom: hp(2), 
    backgroundColor: Colors.white 
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(2)
  },
  headerTitle: { 
    fontSize: wp(6), 
    fontWeight: 'bold', 
    color: Colors.black 
  },
  logoutButton: {
    padding: 5,
  },
  listContent: { padding: wp(5) },
  empty: { textAlign: 'center', marginTop: 50, color: Colors.gray, paddingHorizontal: 20 }
});
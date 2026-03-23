import React, { useState, useCallback } from 'react'; 
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { EventCard } from '../../components/EventCard';
import { Colors } from '../../constants/Colors';
import { SearchBar } from '../../components/SearchBar';
import { eventService } from '../../services/eventService';
import { Event } from '../../models/event';

export default function MyEventsScreen() {
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadMyEvents = async () => {
    try {
      const response = await eventService.getMyParticipations();
      setEvents(response.events);
    } catch (error) {
      console.error("Erreur lors de la récupération de mes events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMyEvents();
    }, [])
  );

  const isEventPast = (startDate: string) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    return eventDate < now;
  };

  const handleLeavePress = (event: Event) => {
    if (isEventPast(event.date_debut)) {
      Alert.alert("Action impossible", "Vous ne pouvez plus vous désister d'un événement qui a déjà commencé.");
      return;
    }

    Alert.alert(
      "Annulation",
      `Voulez-vous vraiment annuler votre participation à "${event.titre}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Oui, me désister", 
          style: "destructive", 
          onPress: () => performLeave(event.id) 
        }
      ]
    );
  };

  const performLeave = async (eventId: number) => {
    try {
      const response = await eventService.leaveEvent(eventId);
      Alert.alert("Succès", response.message);
      loadMyEvents(); 
    } catch (error: any) {
      Alert.alert("Erreur", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMyEvents();
  };

  const filteredEvents = events.filter(event => {
    const searchTerm = search.toLowerCase();
    return (
      event.titre.toLowerCase().includes(searchTerm) || 
      event.lieu.toLowerCase().includes(searchTerm)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Participations</Text>
        <SearchBar
          value={search} 
          onChangeText={setSearch} 
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
              description={item.description}
              startDate={formatDate(item.date_debut)}
              endDate={formatDate(item.date_fin)}
              location={item.lieu}
              price={item.prix.toString()}
              image={item.image || ''}
              participants={Number(item.participants_count) || 0}
              onParticipate={() => handleLeavePress(item)}
              onPress={() => router.push({
                pathname: "/event-details/[id]", 
                params: { id: item.id }
              })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {search 
                ? "Aucun titre ou lieu ne correspond." 
                : "Vous n'avez pas encore de participations."}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: wp(5), paddingTop: hp(6), paddingBottom: hp(2), backgroundColor: Colors.white },
  headerTitle: { 
    fontSize: wp(6), 
    fontWeight: 'bold', 
    color: Colors.black, 
    marginVertical: hp(2),
    textDecorationLine : 'underline', 
    textAlign : 'center'
  },
  listContent: { padding: wp(5) },
  empty: { textAlign: 'center', marginTop: 50, color: Colors.gray }
});
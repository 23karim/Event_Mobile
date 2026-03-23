import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/Colors';
import { EventCard } from '../../src/components/EventCard';
import { SearchBar } from '../../src/components/SearchBar';

import { Event } from '../../src/models/event';
import { eventService } from '../../src/services/eventService';

export default function EventsListScreen() {
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    loadEvents();
  }, []);

  const handleParticipate = async (eventId: number) => {
    try {
      const response = await eventService.joinEvent(eventId);
      Alert.alert("Félicitations", response.message);

      loadEvents(); 
    } catch (error: any) {
      Alert.alert("Information", error);
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
        <Text style={styles.headerTitle}>Trouvez des événements</Text>
        
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
              description={item.description || "Aucune description disponible"} // <--- AJOUTÉ ICI
              startDate={formatDate(item.date_debut)}
              endDate={formatDate(item.date_fin)}
              location={item.lieu}
              price={item.prix.toString()}
              image={item.image || ''}
              participants={Number(item.participants_count) || 0} 
              onParticipate={() => handleParticipate(item.id)}
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
  header: { paddingHorizontal: wp(5), paddingTop: hp(6), paddingBottom: hp(2), backgroundColor: Colors.white },
  headerTitle: { fontSize: wp(6), fontWeight: 'bold', color: Colors.black, marginVertical: hp(2) },
  listContent: { padding: wp(5) },
  empty: { textAlign: 'center', marginTop: 50, color: Colors.gray, paddingHorizontal: 20 }
});
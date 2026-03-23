import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../constants/Colors';
import { eventService } from '../../services/eventService'; 
import { Event } from '../../models/event'; 

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await eventService.getEventById(Number(id));
          setEvent(data);
        }
      } catch (error: any) {
        Alert.alert("Erreur", error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);


  const handleJoin = async () => {
    try {
      if (event) {
        await eventService.joinEvent(event.id);
        Alert.alert("Succès", "Demande de participation envoyée !");
      }
    } catch (error: any) {
      Alert.alert("Erreur", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  if (!event) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.fixedHeader}>
        <Image 
          source={{ uri: event.image || 'https://via.placeholder.com/800x600?text=Pas+d+image' }} 
          style={styles.image} 
        />
        


        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{event.prix} DT</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.spacer} />

        <View style={styles.contentCard}>
          <Text style={styles.title}>{event.titre}</Text>

  
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar" size={20} color={Colors.blue} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Du {event.date_debut}</Text>
              <Text style={styles.infoSub}>Au {event.date_fin}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={20} color={Colors.blue} />
            </View>
            <View>
              <Text style={styles.infoLabel}>{event.lieu}</Text>
              <Text style={styles.infoSub}>Tunis, Tunisie</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="pricetag" size={20} color={Colors.blue} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Tarif de participation</Text>
              <Text style={[styles.infoSub, { fontWeight: 'bold', color: Colors.blue }]}>
                {event.prix} DT par personne
              </Text>
            </View>
          </View>

          <View style={styles.separator} />
          <TouchableOpacity style={styles.mainActionButton} onPress={handleJoin}>
            <Ionicons name="people" size={20} color="white" />
            <Text style={styles.mainActionButtonText}>Participer</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>À propos de l'événement</Text>
          <Text style={styles.description}>{event.description}</Text>
          
          <View style={{ height: hp(10) }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white},
  
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp(45),
    zIndex: 0,
  },
  image: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: hp(6),
    left: wp(5),
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 12,
  },
  priceBadge: {
    position: 'absolute',
    top: hp(6),
    right: wp(5),
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  priceBadgeText: { color: 'white', fontWeight: 'bold', fontSize: wp(4) },

  scrollContent: { flexGrow: 1 },
  spacer: { height: hp(40) }, 
  
  contentCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    minHeight: hp(60),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: { fontSize: wp(7.5), fontWeight: 'bold', color: Colors.black, marginBottom: hp(3) },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(2.5) },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  infoLabel: { fontSize: wp(4.2), fontWeight: '600', color: Colors.black, },
  infoSub: { fontSize: wp(3.5),color: Colors.gray, marginTop: 2 },
  
  separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: hp(2) },

  mainActionButton: {
    backgroundColor: Colors.blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(2),
    borderRadius: 15,
    marginBottom: hp(3),
  },
  mainActionButtonText: { color: 'white', fontWeight: 'bold', fontSize: wp(4.5), marginLeft: 10 },

  sectionTitle: { fontSize: wp(5), fontWeight: 'bold', color: '#1A1D1E', marginBottom: hp(1.5) },
  description: { fontSize: wp(4), color: '#747688', lineHeight: 26 },
});
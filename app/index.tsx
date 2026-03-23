import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>EVENT<Text style={{color: Colors.blue}}>-Project</Text></Text>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color='Colors.blue' />
        <Text style={styles.loadingText}>Chargement de l'expérience...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white, 
    justifyContent: 'center',
    alignItems: 'center'
 },
  brand: { fontSize: 40, fontWeight: '900', letterSpacing: -1, color: '#333' },
  loaderContainer: {top:20, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#999', fontSize: 12, fontWeight: '500' }
});
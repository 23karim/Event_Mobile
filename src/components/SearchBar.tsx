import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../constants/Colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void; 
  onFilterPress?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  onFilterPress, 
  placeholder 
}) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={Colors.gray} />
      
      <TextInput 
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        // React Native s'occupe d'extraire le texte pour nous ici
        onChangeText={onChangeText} 
        placeholderTextColor={Colors.gray}
      />
      
      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F2F2F2', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 55, // Hauteur fixe pour une meilleure consistance
    marginTop: hp(1) 
  },
  searchInput: { 
    flex: 1, 
    height: '100%', 
    marginLeft: 10, 
    fontSize: wp(3.8),
    color: Colors.black 
  },
  filterBtn: { 
    backgroundColor: Colors.blue, 
    padding: 8, 
    borderRadius: 8,
    marginLeft: 5
  },
});
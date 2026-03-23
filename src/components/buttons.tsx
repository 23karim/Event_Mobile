import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Colors } from "../constants/Colors";

interface ButtonProps {
  onPress: () => void;
  buttonText: string;
}

interface ButtonSkipProps {
  count: number;
  onPress: () => void; 
}

const Button: React.FC<ButtonProps> = ({ onPress, buttonText }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[Colors.black, Colors.blue ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const PasserButton: React.FC<ButtonSkipProps> = ({ count, onPress }) => {
  if (count === 0 || count === 1) {
    return (
      <TouchableOpacity
        style={styles.buttonPasser}
        onPress={onPress}
      >
        <Text style={styles.skiptext}>Skip</Text>
      </TouchableOpacity>
    );
  }
  return <View style={{ width: wp(15) }} />;
};
const AddButton: React.FC<ButtonProps> = ({ onPress, buttonText }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.addBtnWrapper}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[Colors.black, Colors.blue || '#2196F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: hp(5),
    justifyContent: "center",
    borderRadius: 25, 
    elevation: 3,   
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    padding: wp(4),
    color: Colors.white,
    fontSize: wp(4.5),
    textAlign: "center",
    fontWeight: "bold",
  },
  addBtnWrapper: {
    marginTop: hp(2),
    marginHorizontal: wp(8),
  },
  buttonPasser: {
    marginRight: wp(5),
    padding: 10,
  },
  skiptext: {
    color: Colors.black,
    fontSize: hp(2.2),
    fontWeight: "600",
  },
});

export { Button, PasserButton, AddButton };
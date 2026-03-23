import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Colors";

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
  isPassword?: boolean;
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  touched,
  isPassword,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.inputWrapper, error && touched && styles.inputError]}>
        <TextInput
          style={[styles.textInput, style]}
          secureTextEntry={isPassword && !isPasswordVisible}
         
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.icon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={Colors.gray }
            />
          </TouchableOpacity>
        )}
      </View>

      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
    width: "100%",
  },
  label: {
    color:Colors.black,
    fontWeight: "600",
    fontSize: wp(4),
    marginBottom: hp(0.5),
    marginLeft: wp(1),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: wp(3),
    height: hp(7),
    paddingHorizontal: wp(4),
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: Colors.error,
  },
  textInput: {
    flex: 1,
    fontSize: wp(3.8),
    color:Colors.black,
  },
  icon: {
    padding: 5,
  },
  errorText: {
    color: Colors.error,
    fontSize: wp(3),
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
});
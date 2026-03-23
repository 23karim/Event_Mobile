import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../../../context/AuthContext";
import { Input } from "../../../components/Input";

import { Colors } from "../../../constants/Colors";
import { Button } from "../../../components/buttons";



const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string().required("Mot de passe requis"),
});

const LoginScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth(); // On récupère la méthode signIn du contexte
  const [loading, setLoading] = useState(false);

  // Fonction de soumission qui consomme l'API via le contexte
  const handleLoginLocal = async (values: any) => {
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      // La redirection vers /(tabs) est gérée automatiquement par le useEffect dans AuthContext
    } catch (error: any) {
      // Affichage de l'erreur venant du backend (ex: "Email ou mot de passe incorrect")
      Alert.alert("Erreur", error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titleText}>Login</Text>

        <Formik
          initialValues={{ email: "karim.kekli@gmail.com", password: "123456789" }}
          validationSchema={LoginSchema}
          onSubmit={handleLoginLocal}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email as string}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password as string}
                touched={touched.password}
                isPassword={true}
              />

              {loading ? (
                <ActivityIndicator size="large" color={Colors.blue} style={{ marginTop: 20 }} />
              ) : (
                <Button onPress={handleSubmit} buttonText="Login" />
              )}

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  titleText: {
    color: Colors.blue,
    fontSize: wp(15),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp(4),
  },
  formContainer: {
    paddingHorizontal: wp(10),
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(4),
  },
  signupText: {
    color: Colors.gray,
    fontSize: wp(3.5),
  },
  signupLink: {
    color: Colors.blue,
    fontWeight: "bold",
    fontSize: wp(3.8),
  },
});

export default LoginScreen;
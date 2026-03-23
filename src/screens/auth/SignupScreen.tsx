import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Input } from "../../components/Input";
import { Button } from "../../components/buttons";
import { Colors } from "../../constants/Colors";
// Import du service
import { authService } from "../../services/authService";

const SignupSchema = Yup.object().shape({
  nom: Yup.string().required("Nom requis"),
  prenom: Yup.string().required("Prénom requis"),
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string().min(8, "Trop court !").required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
  tel: Yup.string().required("Téléphone requis"),
});

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values: any) => {
    setLoading(true);
    
    try {
      // Préparation du FormData (requis car ton backend utilise Multer)
      const formData = new FormData();
      formData.append("nom", values.nom);
      formData.append("prenom", values.prenom);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("tel", values.tel);
      formData.append("role", "client"); // Envoi du rôle par défaut

      const response = await authService.signup(formData);
      
      Alert.alert("Succès", "Votre compte a été créé avec succès !", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") }
      ]);
    } catch (error: any) {
      Alert.alert("Erreur d'inscription", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Créer un compte</Text>
          <Formik
            initialValues={{ 
              nom: "", 
              prenom: "", 
              email: "", 
              password: "",
              confirmPassword: "", 
              tel: "" 
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Input
                      label="Nom"
                      placeholder="Nom"
                      onChangeText={handleChange("nom")}
                      onBlur={handleBlur("nom")}
                      value={values.nom}
                      error={errors.nom}
                      touched={touched.nom}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Prénom"
                      placeholder="Prénom"
                      onChangeText={handleChange("prenom")}
                      onBlur={handleBlur("prenom")}
                      value={values.prenom}
                      error={errors.prenom}
                      touched={touched.prenom}
                    />
                  </View>
                </View>

                <Input
                  label="Téléphone"
                  placeholder="Ex: +216 22 123 456"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("tel")}
                  onBlur={handleBlur("tel")}
                  value={values.tel}
                  error={errors.tel}
                  touched={touched.tel}
                />

                <Input
                  label="Email"
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={errors.email}
                  touched={touched.email}
                />

                <Input
                  label="Mot de passe"
                  placeholder="******"
                  isPassword={true}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={errors.password}
                  touched={touched.password}
                />

                <Input
                  label="Confirmer le mot de passe"
                  placeholder="******"
                  isPassword={true}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                />

                <View style={{ marginTop: hp(2) }}>
                  {loading ? (
                    <ActivityIndicator size="large" color={Colors.blue} />
                  ) : (
                    <Button onPress={handleSubmit} buttonText="S'inscrire" />
                  )}
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Déjà un compte ? </Text>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Se connecter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: hp(5),
  },
  innerContainer: {
    paddingHorizontal: wp(8),
  },
  title: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: Colors.blue,
    textAlign: "center",
    marginBottom: hp(2),
  },
  form: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(3),
  },
  footerText: {
    color: Colors.gray,
    fontSize: wp(3.8),
  },
  link: {
    color: Colors.blue,
    fontWeight: "bold",
    fontSize: wp(3.8),
  },
});
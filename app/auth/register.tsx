import { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import {
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "expo-router";

const logo = require("@/assets/cfelogo.png");

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const { signUp, loading } = useAuth();
  const { colors } = useTheme();

  const handleRegister = async () => {
    try {
      await signUp(username, password, fullname);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={logo} resizeMode="contain" style={styles.logo} />

      <Text variant="headlineMedium" style={styles.title}>
        Crear Cuenta
      </Text>

      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />

      <TextInput
        label="Nombre Completo"
        value={fullname}
        onChangeText={setFullname}
        mode="outlined"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        disabled={!username || !password}
        buttonColor="#008f5a"
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Registrarse
      </Button>

      <View style={styles.linkContainer}>
        <Text style={styles.text}>¿Ya tienes cuenta? </Text>
        <Link
          href="/auth/login"
          style={[styles.link, { color: colors.primary }]}
        >
          Iniciar Sesión
        </Link>
      </View>

      {/* <Link href="/" style={[styles.link, { color: colors.primary }]}>
        ← Volver al inicio
      </Link> */}
    </View>
  );
}

// Reutiliza los mismos estilos del login
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 200,
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

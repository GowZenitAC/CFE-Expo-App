import { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Button, TextInput, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'expo-router';

const logo = require('@/assets/cfelogo.png');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    try {
      await signIn(username, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
      <Image 
        source={logo} 
        resizeMode='contain' 
        style={styles.logo}
      />
      
      <Text variant="headlineMedium" style={styles.title}>
        Iniciar Sesión
      </Text>

      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        activeOutlineColor='#008f5a'
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        activeOutlineColor='#008f5a'
        secureTextEntry
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />

      <Button
        mode="contained"
        buttonColor='#008f5a'
        onPress={handleLogin}
        disabled={!username || !password}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Ingresar
      </Button>

      <View style={styles.linkContainer}>
        <Text style={styles.text}>¿No tienes cuenta? </Text>
        <Link href="/auth/register" style={[styles.link, { color: colors.primary }]}>
          Regístrate
        </Link>
      </View>

      {/* <Link href="/" style={[styles.link, { color: colors.primary }]}>
        ← Volver al inicio
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 200,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
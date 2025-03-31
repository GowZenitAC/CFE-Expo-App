import { Slot } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { registerTranslation, en, es } from 'react-native-paper-dates';
registerTranslation('es', es);
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1a73e8", // Color principal
    secondary: "#f50057", // Color secundario
    background: "#ffffff", // Color de fondo
    surface: "#f8f9fa", // Color de superficie
    error: "#dc3545", // Color para errores
  },
  roundness: 8, // Bordes redondeados
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar backgroundColor="#00905f" style="light" />
          <Slot />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

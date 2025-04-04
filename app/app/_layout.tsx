import { Stack } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { Redirect } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function AppLayout() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ title: "Inicio", headerShown: false }}
      />
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
      <Stack.Screen
        name="reports/index"
        options={{
          title: "Reportes",
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="reports/create/index"
        options={{
          title: "Crear Reporte",
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="reports/[id]"
        options={{
          title: `Detalles del reporte` ,
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="signatures/create"
        options={{
          title: "Crear Firma",
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="vales/index"
        options={{
          title: "Vales",
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="vales/create/index"
        options={{
          title: "Añadir Vale",
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="history/index"
        options={{
          title: "Historial",
          headerStyle: { backgroundColor: "#00905f" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
    
  );
}
const styles = StyleSheet.create({
  headerButton: {
    padding: 8, // Espacio alrededor del ícono para un área de toque más grande
  },
});

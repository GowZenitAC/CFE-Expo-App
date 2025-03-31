import { Stack } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
import { Redirect } from "expo-router";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

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
          headerRight: () => {
            return (
              <IconButton
                icon="plus-circle-outline"
                iconColor="#fff"
                size={26}
                onPress={() => router.push("/app/reports/create")}
              />
            );
          },
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
    </Stack>
  );
}

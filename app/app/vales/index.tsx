import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, Title, Paragraph, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

// Interfaz para los datos del vale (ajusta según tu estructura en Supabase)
interface Vale {
  id: string;
  vale_url: string;
  signature_id: string;
  user_id: string;
  created_at: string;
}

export default function ValesListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [vales, setVales] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(false);

  // Verificar que el usuario esté autenticado
  if (!user) {
    Alert.alert("Error", "Usuario no autenticado");
    return null;
  }

  // Función para obtener los vales desde Supabase
  const fetchVales = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vales")
        .select("id, vale_url, signature_id, user_id, created_at")
        .eq("user_id", user.id) // Solo obtener los vales del usuario autenticado
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener los vales:", error);
        Alert.alert("Error", "No se pudieron cargar los vales.");
        return;
      }

      setVales(data || []);
    } catch (error) {
      console.error("Error en fetchVales:", error);
      Alert.alert("Error", "Ocurrió un error al cargar los vales.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  // Usar useFocusEffect para recargar los datos cuando la pantalla se enfoque
  useFocusEffect(
    useCallback(() => {
      fetchVales();
    }, [fetchVales])
  );

  // Función para renderizar cada vale en la lista
  const renderVale = ({ item }: { item: Vale }) => (
    <Card
      style={styles.card}
      onPress={() => {
        /* Opcional: Navegar a una pantalla de detalles */
      }}
    >
      <Card.Cover source={{ uri: item.vale_url }} style={styles.cardImage} />
      <Card.Content>
        <Title style={styles.cardTitle}>Vale #{item.id}</Title>
        <Paragraph style={styles.cardText}>
          Fecha: {new Date(item.created_at).toLocaleDateString()}
        </Paragraph>
        <Paragraph style={styles.cardText}>
          Firma ID: {item.signature_id}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#008f5a" style={styles.loader} />
      ) : vales.length === 0 ? (
        <Paragraph style={styles.emptyText}>
          No hay vales para mostrar.
        </Paragraph>
      ) : (
        <FlatList
          data={vales}
          renderItem={renderVale}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <Title style={styles.headerTitle}>Últimos 5 vales</Title>
            </View>
          }
        />
      )}

      {/* Botón flotante para crear un nuevo vale */}
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={() => router.push("app/vales/create")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Espacio para el FAB
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
  },
  cardImage: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    flex: 1,
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#008f5a",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

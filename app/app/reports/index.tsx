// app/(app)/reports/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import Inspection from "@/interfaces/Inspection";

export default function ReportsScreen() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const fetchInspections = useCallback(async () => {
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select("*")
        .eq("user_id", user.id)
        .order("fecha", { ascending: false })
        .limit(5);

      if (error) throw error;

      setInspections(data || []);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      Alert.alert("Error", "No se pudieron cargar las inspecciones");
    } finally {
      setLoading(false);
    }
  }, [user]);
  useFocusEffect(
    useCallback(() => {
      fetchInspections();
    }, [fetchInspections])
  );
  const renderInspection = ({ item }: { item: Inspection }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Inspección del {item.fecha}</Title>
        <Paragraph>Placas: {item.placas_vehiculo}</Paragraph>
        <Paragraph>
          Hora: {item.hora_inicio} - {item.hora_finalizacion}
        </Paragraph>
        {item.litros_gasolina_gastada && (
          <Paragraph>
            Litros de gasolina gastada: {item.litros_gasolina_gastada}
          </Paragraph>
        )}
        {item.observaciones && (
          <Paragraph>Observaciones: {item.observaciones}</Paragraph>
        )}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`/app/reports/${item.id}`)}>
          Ver Detalles
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#008f5a" />
        <Text style={styles.loadingText}>Cargando inspecciones...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {inspections.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hay inspecciones disponibles.</Text>
          <Button
            mode="contained"
            onPress={() => router.push("/app/reports/create")}
            style={styles.createButton}
          >
            Crear Nueva Inspección
          </Button>
        </View>
      ) : (
        <FlatList
          data={inspections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInspection}
          ListHeaderComponent={
            <View style={styles.header}>
              <Title style={styles.headerTitle}>Últimos 5 reportes</Title>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 10,
    borderRadius: 8,
    elevation: 3,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: "#008f5a",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
});

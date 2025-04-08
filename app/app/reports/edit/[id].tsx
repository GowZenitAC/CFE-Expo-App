import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Title, ActivityIndicator } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/lib/AuthContext";

// Definimos el tipo para los datos del formulario
type EditInspectionFormData = {
  litros_gasolina_gastada?: number;
  kilometraje_final?: number;
};

// Definimos el tipo para la inspección (basado en tu interfaz Inspection)
interface Inspection {
  id: number;
  litros_gasolina_gastada?: number;
  kilometraje_final?: number;
}

export default function EditInspectionScreen() {
  const { id } = useLocalSearchParams(); // Obtenemos el ID de la inspección desde los parámetros de la URL
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState<Inspection | null>(null);

  // Configuramos el formulario con react-hook-form
  const { control, handleSubmit, reset } = useForm<EditInspectionFormData>({
    defaultValues: {
      litros_gasolina_gastada: undefined,
      kilometraje_final: undefined,
    },
  });

  // Verificamos que el usuario esté autenticado
  if (!user) {
    Alert.alert("Error", "Usuario no autenticado");
    return null;
  }

  // Función para cargar los datos de la inspección
  const fetchInspection = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select("id, litros_gasolina_gastada, kilometraje_final")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (!data) {
        Alert.alert("Error", "Inspección no encontrada");
        router.back();
        return;
      }

      setInspection(data);
      // Rellenamos el formulario con los datos actuales
      reset({
        litros_gasolina_gastada: data.litros_gasolina_gastada,
        kilometraje_final: data.kilometraje_final,
      });
    } catch (error) {
      console.error("Error fetching inspection:", error);
      Alert.alert("Error", "No se pudo cargar la inspección");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, user.id, router, reset]);

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: EditInspectionFormData) => {
    try {
        console.log("Submitting data:", typeof data.litros_gasolina_gastada, typeof data.kilometraje_final); // Agregamos un log para ver los datos enviados
      const { error } = await supabase
        .from("inspections")
        .update({
          litros_gasolina_gastada: data.litros_gasolina_gastada,
          kilometraje_final: data.kilometraje_final,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      Alert.alert("Éxito", "Inspección actualizada correctamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating inspection:", error);
      Alert.alert("Error", "No se pudo actualizar la inspección");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#008f5a" />
      </View>
    );
  }

  if (!inspection) {
    return null; // Si no se encuentra la inspección, ya se manejó en fetchInspection
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Editar Inspección</Title>

      {/* Campo para Litros de gasolina gastada */}
      <Controller
        control={control}
        name="litros_gasolina_gastada"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Litros de gasolina gastada"
            value={value?.toString() || ""}
            onChangeText={(text) => onChange(text ? parseFloat(text) : undefined)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        )}
      />

      {/* Campo para Kilometraje final */}
      <Controller
        control={control}
        name="kilometraje_final"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Kilometraje final"
            value={value?.toString() || ""}
            onChangeText={(text) => onChange(text ? parseFloat(text) : undefined)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        )}
      />

      {/* Botones para guardar o cancelar */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          buttonColor="#008f5a"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        >
          Guardar
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.button}
        >
          Cancelar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
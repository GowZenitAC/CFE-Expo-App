import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert, Text } from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { TextInput } from "react-native-paper";
import {
  reportSchema,
  ReportFormData,
} from "@/app/app/reports/schemas/reportSchema";
import { useAuth } from "@/lib/AuthContext";

import DatePickerInput from "@/app/app/reports/create/components/DatePickerInput";
import TimePickerInput from "@/app/app/reports/create/components/TimePickerInput";
import SwitchField from "@/app/app/reports/create/components/SwitchField";
import FormSection from "@/app/app/reports/create/components/FormSection";
import TextInputField from "./components/TextInputField";
import RadioField from "./components/RadioField";
import SignatureSelector from "@/app/app/reports/create/components/SignatureSelector";
import { Signature } from "@/types/signature";
import { useRouter } from 'expo-router';

export default function ReportCreateScreen() {
  const router = useRouter(); 
  // Obtener el objeto completo de useForm
  const methods = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      fecha: new Date(), 
      hora_inicio: "",
      hora_finalizacion: ""
    }
  });

  // Desestructurar las propiedades que necesitas
  const { control, handleSubmit, formState: { errors } } = methods;

  const [selectedSignature, setSelectedSignature] = useState<Signature | undefined>(undefined);
  const { user } = useAuth();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const onSubmit = async (data: ReportFormData) => {
    if (!selectedSignature || !selectedSignature.id) {
      Alert.alert("Error", "Debe seleccionar una firma");
      return;
    }
    const reportData = {
      ...data,
      user_id: user.id,
      fecha: data.fecha.toISOString().split('T')[0],
      user_signature_id: selectedSignature.id
       // Convertir a ISO string
    };
    console.log("Report Data:", {reportData});
    try {
      const { error } = await supabase.from("inspections").insert(reportData);
      if (error) throw error;
      Alert.alert("Éxito", "Reporte guardado correctamente",[
        {
          text: "OK",
          onPress: () => {
            // Opcional: Resetear el formulario
            methods.reset();
            // Navegar de regreso a la pantalla de lista
            router.replace('/app/reports');
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating report:", error);
      Alert.alert("Error", "No se pudo guardar el reporte");
    }
  };

  return (
    // Pasar el objeto completo de useForm a FormProvider
    <FormProvider {...methods}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <FormSection title="Datos Generales">
          <DatePickerInput name="fecha" control={control} label="Fecha" />
          <TextInput value={user.username} label={"RPE"} disabled />
          <TextInputField
            control={control}
            label="Placas del Vehículo"
            name="placas_vehiculo"
            keyboardType="default"
          />
        </FormSection>

        <FormSection title="Condiciones del Vehiculo">
          <RadioField control={control} name="viseras" label="Viseras" />
          <RadioField control={control} name="espejo_interior" label="Espejo Interior" />
          <RadioField control={control} name="espejo_lateral" label="Espejos Laterales" />
          <RadioField control={control} name="cristales_puerta" label="Cristales de Puerta" />
          <RadioField control={control} name="parabrisas" label="Parabrisas" />
          <RadioField control={control} name="elevadores_cristales" label="Elevadores de Cristales" />
          <RadioField control={control} name="cerraduras" label="Cerraduras" />
          <RadioField control={control} name="cinturon_seguridad" label="Cinturon de Seguridad" />
          <RadioField control={control} name="volante" label="Volante" />
          <RadioField control={control} name="luces_delanteras" label="Luces Delanteras" />
          <RadioField control={control} name="limpieza_vehiculo" label="Limpieza del Vehículo" />
          <RadioField control={control} name="cuartos" label="Luces de Cuartos" />
          <RadioField control={control} name="luces_frenos" label="Luces de Frenos" />
          <RadioField control={control} name="luces_direccionales" label="Luces Direccionales" />
          <RadioField control={control} name="luces_intermitentes" label="Luces Intermitentes" />
          <RadioField control={control} name="freno_pie" label="Freno de Pie" />
          <RadioField control={control} name="freno_mano" label="Freno de Mano" />
          <RadioField control={control} name="nivel_aceite_motor" label="Nivel de Aceite del Motor" />
          <RadioField control={control} name="nivel_aceite_trans" label="Nivel de Aceite de Transmision" />
          <RadioField control={control} name="liquido_frenos" label="Liquido de Frenos" />
          <RadioField control={control} name="llantas" label="Llantas" />
          <TextInputField
            control={control}
            label="Litros de gasolina gastada"
            name="litros_gasolina_gastada"
            keyboardType="numeric"
          />
        </FormSection>

        <FormSection title="Accesorios">
          <View style={styles.switchContainer}>
            <View style={styles.switchColumn}>
              <SwitchField control={control} name="botiquin" label="Botiquín" />
              <SwitchField control={control} name="extintor" label="Extintor" />
              <SwitchField control={control} name="gato_hidraulico" label="Gato Hidráulico" />
              <SwitchField control={control} name="cruceta" label="Cruceta" />
            </View>
            <View style={styles.switchColumn}>
              <SwitchField control={control} name="lampara_mano" label="Lámpara de Mano" />
              <SwitchField control={control} name="cables_pasacorriente" label="Cables Pasacorriente" />
              <SwitchField control={control} name="llanta_refaccion" label="Llanta de Refacción" />
              <SwitchField control={control} name="luces_reflejantes" label="Luces Reflejantes" />
            </View>
          </View>
        </FormSection>

        <FormSection title="Tiempo y Observaciones">
          <TimePickerInput control={control} name="hora_inicio" label="Hora de Inicio" />
          <TimePickerInput control={control} name="hora_finalizacion" label="Hora de Finalización" />
          <TextInputField control={control} label="observaciones" name="Observaciones" />
        </FormSection>

        <FormSection title="Firma Digital">
          <SignatureSelector
            onSelect={setSelectedSignature}
            selectedSignature={selectedSignature}
          />
        </FormSection>

        {/* Mostrar errores del formulario */}
        {Object.keys(errors).length > 0 && (
          <View style={{ marginVertical: 10 }}>
            {Object.entries(errors).map(([field, error]) => (
              <Text key={field} style={{ color: 'red' }}>
                {field}: {error.message}
              </Text>
            ))}
          </View>
        )}

        <Button
          mode="contained"
          buttonColor="#008f5a"
          onPress={() => {
            console.log("Botón presionado");
            handleSubmit(onSubmit)();
          }}
          disabled={!selectedSignature}
          style={{ marginTop: 24 }}
        >
          Guardar Reporte
        </Button>
      </ScrollView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  switchColumn: {
    flex: 1,
    gap: 12,
  },
});
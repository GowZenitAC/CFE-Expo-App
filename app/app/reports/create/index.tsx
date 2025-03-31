import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Form, useForm } from "react-hook-form";
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

export default function ReportCreateScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });
  const { user } = useAuth();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const onSubmit = async (data: ReportFormData) => {
    const reportData = {
      ...data,
      user_id: user.id,
    };
    try {
      const { error } = await supabase.from("inspections").insert(reportData);

      if (error) throw error;
      // Manejar éxito
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <FormSection title="Datos Generales">
        <DatePickerInput name="fecha" control={control} label="Fecha" />
        <TextInput value={user.username} label={"RPE"} disabled />
        <TextInputField
          control={control}
          label="Placas del Vehículo"
          name="placas_vehiculo"
        />
      </FormSection>

      <FormSection title="Condiciones del Vehiculo">
        <RadioField control={control} name="viseras" label="Viseras" />
        <RadioField
          control={control}
          name="espejo_interior"
          label="Espejo Interior"
        />
        <RadioField
          control={control}
          name="espejo_lateral"
          label="Espejos Laterales"
        />
        <RadioField
          control={control}
          name="cristales_puerta"
          label="Cristales de Puerta"
        />
        <RadioField control={control} name="parabrisas" label="Parabrisas" />
        <RadioField
          control={control}
          name="elevadores_cristales"
          label="Elevadores de Cristales"
        />
        <RadioField control={control} name="cerraduras" label="Cerraduras" />
        <RadioField
          control={control}
          name="cinturon_seguridad"
          label="Cinturon de Seguridad"
        />
        <RadioField control={control} name="volante" label="Volante" />
        <RadioField
          control={control}
          name="luces_delanteras"
          label="Luces Delanteras"
        />
        <RadioField
          control={control}
          name="limpieza_vehiculo"
          label="Limpieza del Vehículo"
        />
        <RadioField control={control} name="cuartos" label="Luces de Cuartos" />
        <RadioField
          control={control}
          name="luces_frenos"
          label="Luces de Frenos"
        />
        <RadioField
          control={control}
          name="luces_direccionales"
          label="Luces Direccionales"
        />
        <RadioField
          control={control}
          name="luces_intermitentes"
          label="Luces Intermitentes"
        />
        <RadioField control={control} name="freno_pie" label="Freno de Pie" />
        <RadioField control={control} name="freno_mano" label="Freno de Mano" />
        <RadioField
          control={control}
          name="nivel_aceite_motor"
          label="Nivel de Aceite del Motor"
        />
        <RadioField
          control={control}
          name="nivel_aceite_trans"
          label="Nivel de Aceite de Transmision"
        />
        <RadioField
          control={control}
          name="liquido_frenos"
          label="Liquido de Frenos"
        />
        <RadioField control={control} name="llantas" label="Llantas" />
      </FormSection>

      <FormSection title="Accesorios">
        <View style={styles.switchContainer}>
          <View style={styles.switchColumn}>
            <SwitchField control={control} name="botiquin" label="Botiquín" />
            <SwitchField control={control} name="extintor" label="Extintor" />
            <SwitchField
              control={control}
              name="gato_hidraulico"
              label="Gato Hidráulico"
            />
            <SwitchField control={control} name="cruceta" label="Cruceta" />
          </View>

          <View style={styles.switchColumn}>
            <SwitchField
              control={control}
              name="lampara_mano"
              label="Lámpara de Mano"
            />
            <SwitchField
              control={control}
              name="cables_pasacorriente"
              label="Cables Pasacorriente"
            />
            <SwitchField
              control={control}
              name="llanta_refaccion"
              label="Llanta de Refacción"
            />
            <SwitchField
              control={control}
              name="luces_reflejantes"
              label="Luces Reflejantes"
            />
          </View>
        </View>
      </FormSection>
      <FormSection title="Tiempo y Observaciones">
          <TimePickerInput control={control} name="hora_inicio" label="Hora de Inicio"/>
          <TimePickerInput control={control} name="hora_finalizacion" label="Hora de Finalización"/>
          <TextInputField
          control={control}
          label="observaciones"
          name="Observaciones"
        />
      </FormSection>

      <Button
        mode="contained"
        buttonColor='#008f5a'
        onPress={handleSubmit(onSubmit)}
        style={{ marginTop: 24 }}
      >
        Guardar Reporte
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchColumn: {
    flex: 1,
    gap: 12,
  },
  // Si prefieres una cuadrícula flexible
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridItem: {
    width: '48%', // 2 columnas con espacio entre ellas
  }
});
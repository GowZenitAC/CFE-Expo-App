import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Card, Title, Subheading, Paragraph, Divider, ActivityIndicator, Text } from 'react-native-paper';
import Inspection from '@/interfaces/Inspection';

export default function ReportDetailScreen() {
    const { id } = useLocalSearchParams();
    const [inspection, setInspection] = useState<Inspection | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchInspection = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('inspections')
            .select('*')
            .eq('id', id)
            .single();
  
          if (error) throw error;
  
          setInspection(data);
        } catch (error) {
          console.error("Error fetching inspection:", error);
          Alert.alert("Error", "No se pudo cargar la inspección");
        } finally {
          setLoading(false);
        }
      };
  
      fetchInspection();
    }, [id]);
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#008f5a" />
          <Text style={styles.loadingText}>Cargando inspección...</Text>
        </View>
      );
    }
  
    if (!inspection) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Inspección no encontrada.</Text>
        </View>
      );
    }
  
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Sección: Datos Generales */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Datos Generales</Title>
            <Divider style={styles.divider} />
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Fecha: </Text>
              {new Date(inspection.fecha).toLocaleDateString()}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Placas: </Text>
              {inspection.placas_vehiculo}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Hora: </Text>
              {inspection.hora_inicio} - {inspection.hora_finalizacion}
            </Paragraph>
            {inspection.litros_gasolina_gastada && (
              <Paragraph style={styles.paragraph}>
                <Text style={styles.label}>Litros de gasolina gastada: </Text>
                {inspection.litros_gasolina_gastada}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
  
        {/* Sección: Condiciones del Vehículo */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Condiciones del Vehículo</Title>
            <Divider style={styles.divider} />
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Viseras: </Text>
              {inspection.viseras}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Espejo Interior: </Text>
              {inspection.espejo_interior}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Espejos Laterales: </Text>
              {inspection.espejo_lateral}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Cristales de Puerta: </Text>
              {inspection.cristales_puerta}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Parabrisas: </Text>
              {inspection.parabrisas}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Elevadores de Cristales: </Text>
              {inspection.elevadores_cristales}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Cerraduras: </Text>
              {inspection.cerraduras}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Cinturón de Seguridad: </Text>
              {inspection.cinturon_seguridad}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Volante: </Text>
              {inspection.volante}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Luces Delanteras: </Text>
              {inspection.luces_delanteras}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Limpieza del Vehículo: </Text>
              {inspection.limpieza_vehiculo}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Luces de Cuartos: </Text>
              {inspection.cuartos}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Luces de Frenos: </Text>
              {inspection.luces_frenos}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Luces Direccionales: </Text>
              {inspection.luces_direccionales}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Luces Intermitentes: </Text>
              {inspection.luces_intermitentes}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Freno de Pie: </Text>
              {inspection.freno_pie}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Freno de Mano: </Text>
              {inspection.freno_mano}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Nivel de Aceite del Motor: </Text>
              {inspection.nivel_aceite_motor}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Nivel de Aceite de Transmisión: </Text>
              {inspection.nivel_aceite_trans}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Líquido de Frenos: </Text>
              {inspection.liquido_frenos}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text style={styles.label}>Llantas: </Text>
              {inspection.llantas}
            </Paragraph>
          </Card.Content>
        </Card>
  
        {/* Sección: Accesorios */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Accesorios</Title>
            <Divider style={styles.divider} />
            <View style={styles.accessoriesContainer}>
              <View style={styles.accessoriesColumn}>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Botiquín: </Text>
                  {inspection.botiquin ? 'Sí' : 'No'}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Extintor: </Text>
                  {inspection.extintor ? 'Sí' : 'No'}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Gato Hidráulico: </Text>
                  {inspection.gato_hidraulico ? 'Sí' : 'No'}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Cruceta: </Text>
                  {inspection.cruceta ? 'Sí' : 'No'}
                </Paragraph>
              </View>
              <View style={styles.accessoriesColumn}>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Lámpara de Mano: </Text>
                  {inspection.lampara_mano ? 'Sí' : 'No'}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Cables Pasacorriente: </Text>
                  {inspection.cables_pasacorriente ? 'Sí' : 'No'}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Llanta de Refacción: </Text>
                  {inspection.llanta_refaccion ? 'Sí' : 'No'}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Luces Reflejantes: </Text>
                  {inspection.luces_reflejantes ? 'Sí' : 'No'}
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
  
        {/* Sección: Observaciones */}
        {inspection.observaciones && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Observaciones</Title>
              <Divider style={styles.divider} />
              <Paragraph style={styles.paragraph}>{inspection.observaciones}</Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32, // Espacio adicional al final para mejor desplazamiento
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      marginBottom: 16,
      borderRadius: 12,
      elevation: 4,
      backgroundColor: '#fff',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    divider: {
      marginBottom: 12,
      backgroundColor: '#e0e0e0',
    },
    paragraph: {
      fontSize: 16,
      color: '#444',
      marginBottom: 8,
    },
    label: {
      fontWeight: 'bold',
      color: '#666',
    },
    accessoriesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    accessoriesColumn: {
      flex: 1,
    },
    loadingText: {
      marginTop: 8,
      fontSize: 16,
      color: '#666',
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
    },
  });
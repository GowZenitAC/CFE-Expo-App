import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  SegmentedButtons,
  TextInput,
  Button,
  Menu,
  Divider,
  FAB,
  Modal,
  Portal,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Interfaces proporcionadas
interface Vale {
  id: number;
  vale_url: string;
  signature_id: string;
  user_id: string;
  created_at: string;
}

interface Inspection {
  id: number;
  user_id: string;
  user_signature_id: number | string;
  fecha: string;
  placas_vehiculo: string;
  viseras: string;
  espejo_interior: string;
  espejo_lateral: string;
  cristales_puerta: string;
  parabrisas: string;
  elevadores_cristales: string;
  cerraduras: string;
  cinturon_seguridad: string;
  volante: string;
  luces_delanteras: string;
  limpieza_vehiculo: string;
  cuartos: string;
  luces_frenos: string;
  luces_direccionales: string;
  luces_intermitentes: string;
  freno_pie: string;
  freno_mano: string;
  nivel_aceite_motor: string;
  nivel_aceite_trans: string;
  liquido_frenos: string;
  llantas: string;
  litros_gasolina_gastada?: number;
  botiquin: boolean;
  extintor: boolean;
  gato_hidraulico: boolean;
  cruceta: boolean;
  lampara_mano: boolean;
  cables_pasacorriente: boolean;
  llanta_refaccion: boolean;
  luces_reflejantes: boolean;
  hora_inicio: string;
  hora_finalizacion: string;
  observaciones?: string;
}

// Tipo para los elementos del historial
type HistoryItem =
  | { type: "vale"; data: Vale }
  | { type: "inspection"; data: Inspection };

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para los filtros
  const [filterType, setFilterType] = useState<"all" | "vales" | "inspections">(
    "all"
  );
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [botiquinFilter, setBotiquinFilter] = useState<"all" | "yes" | "no">(
    "all"
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const resetFilters = () => {
    setFilterType("all");
    setSearchText("");
    setStartDate(null);
    setEndDate(null);
    setBotiquinFilter("all");
  };

  // Verificar que el usuario esté autenticado
  if (!user) {
    Alert.alert("Error", "Usuario no autenticado");
    return null;
  }

  // Función para obtener los vales e inspecciones desde Supabase
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data: valesData, error: valesError } = await supabase
        .from("vales")
        .select("id, vale_url, signature_id, user_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (valesError) {
        console.error("Error al obtener los vales:", valesError);
        Alert.alert("Error", "No se pudieron cargar los vales.");
        return;
      }

      const { data: inspectionsData, error: inspectionsError } = await supabase
        .from("inspections")
        .select("*")
        .eq("user_id", user.id)
        .order("fecha", { ascending: false });

      if (inspectionsError) {
        console.error("Error al obtener las inspecciones:", inspectionsError);
        Alert.alert("Error", "No se pudieron cargar las inspecciones.");
        return;
      }

      const valesItems: HistoryItem[] = (valesData || []).map((vale) => ({
        type: "vale" as const,
        data: vale,
      }));

      const inspectionsItems: HistoryItem[] = (inspectionsData || []).map(
        (inspection) => ({
          type: "inspection" as const,
          data: inspection,
        })
      );

      const combinedItems = [...valesItems, ...inspectionsItems].sort(
        (a, b) => {
          const dateA =
            a.type === "vale"
              ? new Date(a.data.created_at)
              : new Date(a.data.fecha);
          const dateB =
            b.type === "vale"
              ? new Date(b.data.created_at)
              : new Date(b.data.fecha);
          return dateB.getTime() - dateA.getTime();
        }
      );

      setHistoryItems(combinedItems);
      setFilteredItems(combinedItems);
    } catch (error) {
      console.error("Error en fetchHistory:", error);
      Alert.alert("Error", "Ocurrió un error al cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  // Recargar los datos cuando la pantalla se enfoque
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  // Función para aplicar los filtros
  const applyFilters = useCallback(() => {
    let filtered = [...historyItems];

    // Filtro por tipo (vales, inspecciones, o ambos)
    if (filterType !== "all") {
      filtered = filtered.filter((item) => {
        if (filterType === "vales") return item.type === "vale";
        if (filterType === "inspections") return item.type === "inspection";
        return true;
      });
    }

    // Filtro por texto de búsqueda
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((item) => {
        if (item.type === "vale") {
          const vale = item.data;
          return (
            vale.id.toString().toLowerCase().includes(searchLower) ||
            vale.signature_id.toString().toLowerCase().includes(searchLower)
          );
        } else {
          const inspection = item.data;
          return (
            inspection.id.toString().includes(searchLower) ||
            inspection.placas_vehiculo.toLowerCase().includes(searchLower) ||
            inspection.user_signature_id
              .toString()
              .toLowerCase()
              .includes(searchLower) ||
            (inspection.observaciones?.toLowerCase() || "").includes(
              searchLower
            )
          );
        }
      });
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      filtered = filtered.filter((item) => {
        const itemDate =
          item.type === "vale"
            ? new Date(item.data.created_at)
            : new Date(item.data.fecha);
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    // Filtro por estado de botiquín (solo para inspecciones)
    if (botiquinFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (item.type === "inspection") {
          const inspection = item.data;
          return botiquinFilter === "yes"
            ? inspection.botiquin
            : !inspection.botiquin;
        }
        return true;
      });
    }

    setFilteredItems(filtered);
  }, [
    historyItems,
    filterType,
    searchText,
    startDate,
    endDate,
    botiquinFilter,
  ]);

  // Aplicar los filtros cada vez que cambien los criterios
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Función para renderizar cada elemento del historial
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    if (item.type === "vale") {
      const vale = item.data;
      return (
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri: vale.vale_url }}
            style={styles.cardImage}
          />
          <Card.Content>
            <Title style={styles.cardTitle}>Vale #{vale.id}</Title>
            <Paragraph style={styles.cardText}>
              Fecha: {vale.created_at.split("T")[0]}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Firma ID: {vale.signature_id}
            </Paragraph>
          </Card.Content>
        </Card>
      );
    } else {
      const inspection = item.data;
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Inspección #{inspection.id}</Title>
            <Paragraph style={styles.cardText}>
              Fecha: {inspection.fecha}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Placas: {inspection.placas_vehiculo}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Firma ID: {inspection.user_signature_id}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Observaciones: {inspection.observaciones || "Ninguna"}
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => router.push(`/app/reports/${inspection.id}`)}
            >
              Ver Detalles
            </Button>
          </Card.Actions>
        </Card>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Filtro por tipo (SegmentedButtons) en la página principal */}
      <View style={styles.header}>
        <SegmentedButtons
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "all" | "vales" | "inspections")
          }
          buttons={[
            { value: "all", label: "Todo" },
            { value: "vales", label: "Vales" },
            { value: "inspections", label: "Inspecciones" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Lista de historial */}
      {loading ? (
        <ActivityIndicator size="large" color="#008f5a" style={styles.loader} />
      ) : filteredItems.length === 0 ? (
        <Paragraph style={styles.emptyText}>
          No hay elementos para mostrar.
        </Paragraph>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Botón flotante para abrir los filtros */}
      <FAB
        style={styles.fab}
        icon="filter"
        color="#fff"
        onPress={() => setModalVisible(true)}
      />

      {/* Modal para los filtros adicionales */}
      <Portal>
  <Modal
    visible={modalVisible}
    onDismiss={() => setModalVisible(false)}
    contentContainerStyle={styles.modalContainer}
  >
    <Title style={styles.modalTitle}>Filtros Adicionales</Title>

    {/* Filtro por texto */}
    <TextInput
      label="Buscar..."
      value={searchText}
      onChangeText={setSearchText}
      style={styles.modalInput}
      mode="outlined"
    />

    {/* Filtro por fecha de inicio */}
    <Button
      mode="outlined"
      onPress={() => setShowStartDatePicker(true)}
      style={styles.modalButton}
    >
      {startDate ? startDate.toLocaleDateString() : "Fecha Inicio"}
    </Button>
    {showStartDatePicker && (
      <DateTimePicker
        value={startDate || new Date()}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={(event, selectedDate) => {
          setShowStartDatePicker(false);
          if (selectedDate) setStartDate(selectedDate);
        }}
      />
    )}

    {/* Filtro por fecha de fin */}
    <Button
      mode="outlined"
      onPress={() => setShowEndDatePicker(true)}
      style={styles.modalButton}
    >
      {endDate ? endDate.toLocaleDateString() : "Fecha Fin"}
    </Button>
    {showEndDatePicker && (
      <DateTimePicker
        value={endDate || new Date()}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={(event, selectedDate) => {
          setShowEndDatePicker(false);
          if (selectedDate) setEndDate(selectedDate);
        }}
      />
    )}

    {/* Filtro por estado de botiquín */}
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Button
          mode="outlined"
          onPress={() => setMenuVisible(true)}
          style={styles.modalButton}
        >
          Botiquín:{" "}
          {botiquinFilter === "all"
            ? "Todos"
            : botiquinFilter === "yes"
            ? "Sí"
            : "No"}
        </Button>
      }
    >
      <Menu.Item
        onPress={() => {
          setBotiquinFilter("all");
          setMenuVisible(false);
        }}
        title="Todos"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setBotiquinFilter("yes");
          setMenuVisible(false);
        }}
        title="Sí"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setBotiquinFilter("no");
          setMenuVisible(false);
        }}
        title="No"
      />
    </Menu>

    {/* Botones para aplicar, borrar filtros y cerrar */}
    <View style={styles.modalActions}>
      {/* <Button
        mode="contained"
        onPress={() => {
          applyFilters();
          setModalVisible(false);
        }}
        style={styles.modalActionButton}
        buttonColor="#008f5a"
      >
        Aplicar
      </Button> */}
      <Button
        mode="contained"
         buttonColor="#008f5a"
        onPress={resetFilters}
        style={styles.modalActionButton}
      >
        Borrar Filtros
      </Button>
      <Button
        mode="outlined"
        onPress={() => setModalVisible(false)}
        style={styles.modalActionButton}
      >
        Cerrar
      </Button>
    </View>
  </Modal>
</Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  segmentedButtons: {
    width: "100%", // Ajustar al ancho disponible
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
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalButton: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

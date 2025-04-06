import { useState } from "react";
import { ScrollView, View, StyleSheet, Image, Alert } from "react-native";
import { Card, Title, Button } from "react-native-paper";
import SignatureSelector from "@/app/app/reports/create/components/SignatureSelector";
import { Signature } from "@/types/signature";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/AuthContext";
import { uploadPhoto, createVale } from "@/lib/valeService";
import { set } from "date-fns";

// Placeholder para la imagen (puedes reemplazar esto con una imagen real o un componente de vista previa)
const placeholderImage = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";

export default function ValesCreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedSignature, setSelectedSignature] = useState<
    Signature | undefined
  >(undefined);
  const [photoUri, setPhotoUri] = useState<string>(placeholderImage); // Inicializa con el placeholder
  const [loading, setLoading] = useState(false);

  if (!user) {
    Alert.alert("Error", "Usuario no autenticado");
    return null;
  }

  const handleSelectSignature = (signature: Signature) => {
    setSelectedSignature(signature);
  };

  // Función para tomar una foto con la cámara
  const takePhoto = async () => {
    // Solicitar permisos para la cámara
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permiso Requerido",
        "Se necesitan permisos para acceder a la cámara. Por favor, habilita los permisos en la configuración de tu dispositivo."
      );
      return;
    }

    // Abrir la cámara
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Permitir al usuario recortar/editar la foto
      aspect: [1, 1], // Relación de aspecto 1:1 (cuadrada)
      quality: 0.5, // Calidad de la imagen (0 a 1)
    });

    // Verificar si el usuario tomó una foto o canceló
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("se tomo una foto: " + result.assets[0].uri);
      const uri = result.assets[0].uri;
      setPhotoUri(uri); // Actualizar el estado con la URI de la foto tomada
    }
  };

  const handleSave = async () => {
    if (!selectedSignature) {
      Alert.alert(
        "Error",
        "Debes seleccionar una firma antes de tomar la foto."
      );
      setPhotoUri(placeholderImage); // Restaurar el placeholder
      return;
    }

    if (!photoUri || photoUri === placeholderImage) {
      Alert.alert("Error", "Debes tomar una foto del vale.");
      return;
    }
    setLoading(true);

    const photoUrl = await uploadPhoto(photoUri);
    if (!photoUrl) {
      Alert.alert("Error", "No se pudo subir la foto.");
      setLoading(false);
      return;
    }

    setPhotoUri(photoUrl); // Actualizar el estado con la URI de la foto subida
    // Alert.alert("Éxito", "Foto subida correctamente.");
    console.log("URL de la foto subida:", photoUrl);

    try {
      const valeData = {
        vale_url: photoUrl,
        signature_id: selectedSignature.id,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };
      await createVale(valeData);
      // console.log("Vale creado:", valeData);
      Alert.alert("Éxito", "Vale creado correctamente", [
        {
          text: "Aceptar",
          onPress: () => router.back(), // Volver a la pantalla anterior
        },
      ]);
    } catch (error) {
      console.error("Error al crear el vale:", error);
      Alert.alert("Error", "No se pudo crear el vale.");
    } finally {
      setLoading(false);
      setPhotoUri(placeholderImage); // Restaurar el placeholder
      setSelectedSignature(undefined); // Limpiar la firma seleccionada
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.container}>
        {/* Sección: Foto del Vale */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Foto del Vale</Title>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photoUri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
              <Button
                mode="contained"
                icon="camera"
                onPress={takePhoto}
                style={styles.cameraButton}
                buttonColor="#008f5a"
                disabled={loading}
                loading={loading}
              >
                Tomar Foto
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Sección: Firma Digital */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Firma Digital</Title>
            <SignatureSelector
              onSelect={handleSelectSignature}
              selectedSignature={selectedSignature}
            />
          </Card.Content>
        </Card>

        {/* Botón para guardar */}
        <Button
          mode="contained"
          onPress={() => handleSave()}
          style={styles.submitButton}
          buttonColor="#008f5a"
          disabled={loading || !selectedSignature || !photoUri || photoUri === placeholderImage} // Deshabilitar si no hay firma o foto
        >
          Guardar Vale
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  photoContainer: {
    alignItems: "center",
  },
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#e0e0e0", // Fondo gris para el placeholder
  },
  cameraButton: {
    width: 150,
  },

  submitButton: {
    marginTop: 24,
  },
});

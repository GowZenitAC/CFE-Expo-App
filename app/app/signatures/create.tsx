import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { Button } from 'react-native-paper';
import { useAuth } from '@/lib/AuthContext';
import { SignatureService } from '@/lib/signatureService';
import { useRouter } from 'expo-router';

export default function SignatureCreateScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const signatureRef = useRef<any>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    if (!signatureData) {
      Alert.alert('Error', 'Debe crear una firma primero');
      return; 
    }

    setIsUploading(true);
    try {
      console.log('Base64:', signatureData.slice(0, 50) + '...');
      await SignatureService.uploadSignature(user.id, signatureData);
      router.back();
    } catch (error) {
      Alert.alert('Error al guardar la firma');
      console.error('Error al guardar la firma:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignatureData(null);
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        ref={signatureRef}
        onOK={(signature: string) => setSignatureData(signature) }
        imageType="image/png"
        penColor="#000000"
        backgroundColor="#FFFFFF"
        style={{ flex: 1 }}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        disabled={!signatureData || isUploading}
        loading={isUploading}
      >
        {isUploading ? 'Guardando...' : 'Guardar Firma'}
      </Button>
      <Button
        mode="outlined"
        onPress={handleClear}
        style={styles.button}
        disabled={isUploading}
      >
        Limpiar Firma
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    marginVertical: 10,
  },
});
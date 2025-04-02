import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@/lib/AuthContext';
import { SignatureService } from '@/lib/signatureService';
import { Signature } from '@/types/signature';
import { useRouter } from 'expo-router';

export default function SignatureSelector({
  onSelect,
  selectedSignature
}: {
  onSelect: (signature: Signature) => void;
  selectedSignature?: Signature;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignatures = async () => {
      if (!user) return;
      setLoading(true);
      const data = await SignatureService.getUserSignatures(user.id);
      setSignatures(data);
      setLoading(false);
    };
    
    loadSignatures();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={styles.label}>
        Firma Digital
      </Text>
      
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            icon="pen"
            loading={loading}
          >
            {selectedSignature 
              ? `Firma del ${new Date(selectedSignature.created_at).toLocaleDateString()}`
              : 'Seleccionar Firma'}
          </Button>
        }
      >
        {signatures.map((sig) => (
          <Menu.Item
            key={sig.id}
            title={new Date(sig.created_at).toLocaleDateString()}
            onPress={() => {
              onSelect(sig);
              setVisible(false);
            }}
          />
        ))}
        <Menu.Item
          title="Crear Nueva Firma"
          onPress={() => router.push('/app/signatures/create')}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15
  }, 
  label: {
    marginBottom: 8
  }
});
import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/AuthContext';
import { Signature } from '@/types/signature';
import { ActivityIndicator, Button, Text as PaperText } from 'react-native-paper';

interface SignatureSelectorProps {
  onSelect: (signature: Signature) => void;
  selectedSignature?: Signature;
  refresh?: boolean;
}

const SignatureSelector = memo(({ onSelect, selectedSignature, refresh }: SignatureSelectorProps) => {
  const router = useRouter();
  const {user} = useAuth();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignatures = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('signatures')
          .select('*')
          .eq('user_id', user?.id) // Filtrar por el ID del usuario autenticado 
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log("Firmas obtenidas:", data); // Depuración
        setSignatures(data || []);
      } catch (error) {
        console.error("Error fetching signatures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignatures();
  }, [refresh]);

  const signatureOptions = signatures.map((signature) => ({
    key: signature.id,
    value: `Firma del ${new Date(signature.created_at).toLocaleDateString()}`,
  }));

  const handleSelect = (value: string) => {
    const selected = signatures.find((signature) => signature.id === value);
    if (selected) {
      onSelect(selected);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#008f5a" />
        <Text style={styles.loadingText}>Cargando firmas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PaperText variant="labelLarge" style={styles.label}>
        Firma Digital
      </PaperText>

      {signatures.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay firmas disponibles.</Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => router.push('/app/signatures/create')}
            style={styles.createButton}
            buttonColor="#008f5a"
          >
            Crear Nueva Firma
          </Button>
        </View>
      ) : (
        <SelectList
          setSelected={handleSelect}
          data={signatureOptions}
          placeholder={
            selectedSignature
              ? `Firma del ${new Date(selectedSignature.created_at).toLocaleDateString()}`
              : 'Seleccionar Firma'
          }
          search={false}
          boxStyles={styles.selectBox}
          dropdownStyles={styles.dropdown}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 12,
  },
  selectBox: {
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdown: {
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  createButton: {
    marginTop: 12,
  },
});

export default SignatureSelector;
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

// Interfaz para los datos del vale (ajusta según tu estructura en Supabase)
interface Vale {
  vale_url: string;
  signature_id: string;
  user_id: string;
  created_at?: string;
}

// Función para subir una foto a Supabase Storage
export const uploadPhoto = async (photoUri: string): Promise<string | null> => {
  try {
    // Generar un nombre único para el archivo usando la fecha actual
    const fileName = `vale-${Date.now()}.jpg`;

    // Leer el archivo desde la URI como base64
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convertir el base64 a un ArrayBuffer
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;

    // Subir la foto al bucket 'vales' en Supabase Storage
    const { error } = await supabase.storage
      .from('vales')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Error al subir la foto:', error);
      return null;
    }

    // Obtener la URL pública de la foto subida
    const { data } = supabase.storage.from('vales').getPublicUrl(fileName);

    if (!data.publicUrl) {
      console.error('No se pudo obtener la URL pública de la foto');
      return null;
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error en uploadPhoto:', error);
    return null;
  }
};

export const getUserVale = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from('vales')
      .select('*')
      .eq('id', user_id)
      .single();

    if (error) {
      console.error('Error al obtener el vale:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en getUserVale:', error);
    return null;
  }
}

// Función para guardar un vale en la tabla 'vales'
export const createVale = async (valeData: Vale): Promise<boolean> => {
  try {
    const { error } = await supabase.from('vales').insert(valeData);
    if (error) {
      console.error('Error al guardar el vale:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error en createVale:', error);
    return false;
  }
};
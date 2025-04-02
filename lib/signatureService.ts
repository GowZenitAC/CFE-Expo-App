import {supabase} from '@/lib/supabase';

export const SignatureService = {
  async uploadSignature(userId: string, base64Data: string) {
    try {
      console.log('base64Data recibido:', base64Data.substring(0, 50));

      // Remover el prefijo "data:image/png;base64,"
      const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');

      // Validar el string base64
      if (!/^[a-zA-Z0-9+/]+={0,2}$/.test(base64String)) {
        throw new Error('Formato de imagen base64 inválido');
      }

      // Decodificar base64 a Uint8Array
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log('Tamaño de bytes:', bytes.length);

      // Verificar autenticación
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No hay una sesión activa. Por favor, inicia sesión nuevamente.');
      }

      // Subir el archivo a Supabase Storage
      const fileName = `${userId}/${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(fileName, bytes, {
          contentType: 'image/png',
        });

      if (uploadError) {
        console.error('Error completo de Supabase (upload):', uploadError);
        throw new Error(`Error al subir la firma: ${uploadError.message}`);
      }

      console.log('Firma subida exitosamente:', uploadData);

      // Obtener la URL pública del archivo
      const { data: publicUrlData } = supabase.storage
        .from('signatures')
        .getPublicUrl(fileName);

      const signatureUrl = publicUrlData.publicUrl;
      if (!signatureUrl) {
        throw new Error('No se pudo obtener la URL pública de la firma');
      }

      console.log('URL pública de la firma:', signatureUrl);

      // Insertar el registro en la tabla signatures
      const { data: insertData, error: insertError } = await supabase
        .from('signatures')
        .insert({
          user_id: userId,
          signature_url: signatureUrl,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error completo de Supabase (insert):', insertError);
        throw new Error(`Error al insertar la firma en la base de datos: ${insertError.message}`);
      }

      console.log('Registro insertado en la tabla signatures:', insertData);
      return insertData;
    } catch (error) {
      console.error('Error en uploadSignature:', error);
      throw error;
    }
  },
  async getUserSignatures(userId: string) {
    try {
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error en getUserSignatures:', error);
      throw error;
    }
  },
  
};
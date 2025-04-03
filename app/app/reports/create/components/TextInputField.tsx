import { Controller, Control } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface TextInputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const TextInputField = ({ control, name, label, keyboardType }: TextInputFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            style={styles.input}
            label={label}
            value={value != null ? value.toString() : ''} // Convertir el valor a string para el TextInput
            onChangeText={(text) => {
              // Si el campo es numérico, podemos validar que el texto sea un número válido
              if (keyboardType === 'numeric' && text && !/^\d*\.?\d*$/.test(text)) {
                return; // Ignorar si no es un número válido
              }
              onChange(text || undefined); // Enviar undefined si el campo está vacío
            }}
            mode="outlined"
            error={!!error}
            keyboardType={keyboardType}
          />
          {error && <HelperText style={styles.errorText} type="error">{error.message}</HelperText>}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default TextInputField;
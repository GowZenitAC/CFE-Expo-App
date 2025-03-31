import { Controller, Control, FieldError } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
interface TextInputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
}

const TextInputField = ({ control, name, label, error }: TextInputFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <TextInput
          style={styles.input}
            label={label}
            value={value}
            onChangeText={onChange}
            mode="outlined"
            error={!!error}
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


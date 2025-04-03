import React from 'react';
import { DatePickerInput as DatePicker } from 'react-native-paper-dates';
import { Controller, Control } from 'react-hook-form';
import { Text } from 'react-native';

interface DatePickerProps {
  control: Control<any>;
  name: string;
  label: string;
}

const DatePickerInput = ({ control, name, label }: DatePickerProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <DatePicker
            label={label}
            value={value || undefined} // Asegurarse de que value sea undefined si no hay fecha seleccionada
            onChange={(date) => {
              onChange(date); // Pasar el objeto Date directamente
            }}
            mode="outlined"
            inputMode="start"
            locale="es"
            style={{ marginBottom: 16 }}
            error={!!error}
          />
          {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error.message}</Text>}
        </>
      )}
    />
  );
};

export default DatePickerInput;
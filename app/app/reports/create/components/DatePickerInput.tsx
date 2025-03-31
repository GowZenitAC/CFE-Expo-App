import React from 'react';
import { DatePickerInput as DatePicker } from 'react-native-paper-dates';
import { Controller, Control } from 'react-hook-form';


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
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          mode="outlined"
          inputMode="start"
          locale="es"
          style={{ marginBottom: 16 }}
          error={!!error}
        />
      )}
    />
  );
};

export default DatePickerInput;
// components/TimePickerInput.tsx
import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { format } from 'date-fns';

interface TimePickerInputProps {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
}

 const TimePickerInput = ({ control, name, label, error }: TimePickerInputProps) => {
  const [visible, setVisible] = React.useState(false);
  const [time, setTime] = React.useState<Date>(new Date());

  const handleConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    const newTime = new Date();
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    setTime(newTime);
    setVisible(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <TextInput
            label={label}
            value={value ? format(new Date(value), 'HH:mm') : ''}
            mode="outlined"
            right={<TextInput.Icon icon="clock" onPress={() => setVisible(true)} />}
            onPressIn={() => setVisible(true)}
            error={!!error}
            style={{ marginBottom: 8 }}
          />
          
          <TimePickerModal
            visible={visible}
            onDismiss={() => setVisible(false)}
            onConfirm={({ hours, minutes }) => {
              const date = new Date();
              date.setHours(hours);
              date.setMinutes(minutes);
              onChange(date.toISOString());
              setVisible(false);
            }}
            hours={time.getHours()}
            minutes={time.getMinutes()}
            label="Seleccionar hora"
            cancelLabel="Cancelar"
            confirmLabel="Confirmar"
            animationType="fade"
          />

          {error && <HelperText type="error">{error.message}</HelperText>}
        </>
      )}
    />
  );
};

export default TimePickerInput;
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';

interface TimePickerInputProps {
  control: Control<any>;
  name: string;
  label: string;
}

const TimePickerInput = ({ control, name, label }: TimePickerInputProps) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Si hay un valor, lo parseamos para obtener las horas y minutos
        const getTimeValues = (timeString: string | undefined) => {
          if (!timeString) {
            const now = new Date();
            return { hours: now.getHours(), minutes: now.getMinutes() };
          }
          const [hours, minutes] = timeString.split(':').map(Number);
          return { hours, minutes };
        };

        const { hours, minutes } = getTimeValues(value);

        return (
          <>
            <TextInput
              label={label}
              value={value || ''} // Mostrar el valor en formato HH:mm:ss
              mode="outlined"
              right={<TextInput.Icon icon="clock" onPress={() => setVisible(true)} />}
              onPressIn={() => setVisible(true)}
              error={!!error}
              style={{ marginBottom: 8 }}
              editable={false} // Evitar que el usuario edite manualmente
            />

            <TimePickerModal
              visible={visible}
              onDismiss={() => setVisible(false)}
              onConfirm={({ hours, minutes }) => {
                // Formatear la hora como HH:mm:ss
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
                  .toString()
                  .padStart(2, '0')}:00`;
                onChange(formattedTime); // Pasar el string en formato HH:mm:ss
                setVisible(false);
              }}
              hours={hours}
              minutes={minutes}
              label="Seleccionar hora"
              cancelLabel="Cancelar"
              confirmLabel="Confirmar"
              animationType="fade"
            />

            {error && <HelperText type="error">{error.message}</HelperText>}
          </>
        );
      }}
    />
  );
};

export default TimePickerInput;
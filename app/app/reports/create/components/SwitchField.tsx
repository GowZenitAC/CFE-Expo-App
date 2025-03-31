import React from 'react';
import { Switch, Text } from 'react-native-paper';
import { Controller, Control } from 'react-hook-form';
import { View } from 'react-native';

interface SwitchProps {
  control: Control<any>;
  name: string;
  label: string;
}

 const SwitchField = ({ control, name, label }: SwitchProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Text>{label}</Text>
          <Switch value={value} onValueChange={onChange} style={{ marginLeft: 10 }} />
        </View>
      )}
    />
  );
};

export default SwitchField;
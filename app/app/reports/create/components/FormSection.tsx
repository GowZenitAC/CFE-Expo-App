import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

 const FormSection = ({ title, children }: SectionProps) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text variant='titleLarge' style={{ marginBottom: 16 }}>
        {title}
      </Text>
      {children}
    </View>
  );
};

export default FormSection;
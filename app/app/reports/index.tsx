// app/(app)/reports/index.tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const reports = [
  { id: 1, title: 'Reporte 1', description: 'Descripción del reporte 1' },
  { id: 2, title: 'Reporte 2', description: 'Descripción del reporte 2' },
];

export default function ReportsScreen() {
  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card style={{ margin: 10 }}>
          <Card.Content>
            <Title>{item.title}</Title>
            <Paragraph>{item.description}</Paragraph>
          </Card.Content>
        </Card>
      )}
    />
  );
}
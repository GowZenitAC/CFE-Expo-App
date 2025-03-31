import { RadioButton } from 'react-native-paper';
import { Controller, Control } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import { ReportFormData } from '../../schemas/reportSchema';


interface RadioProps {
    control: Control<ReportFormData>;
    name: keyof ReportFormData;
    label: string;
}
const RadioField = ({ control, name, label } : RadioProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <View style={styles.container}>
        <Text>{label}</Text>
        <RadioButton.Group onValueChange={onChange} value={typeof value === 'string' ? value : 'bien'}>
          <View style={styles.radioGroup}>
            <RadioButton.Item 
              label="Bien" 
              value="bien" 
              color="#00905f"
            />
            <RadioButton.Item 
              label="Mal" 
              value="mal" 
              color="#ff4444"
            />
          </View>
        </RadioButton.Group>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0'
      },
      label: {
        marginBottom: 10,
        fontWeight: '600',
        color: '#424242'
      },
      radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around'
      },
      radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
      },
      radioText: {
        fontSize: 16,
        color: '#757575'
      },
      radioSelected: {
        color: '#00905f',
        fontWeight: 'bold'
      },
      errorText: {
        color: '#d32f2f',
        marginTop: 5,
        fontSize: 12
      }
})

export default RadioField;
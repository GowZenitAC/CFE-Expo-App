import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import menuItems from '@/lib/menuItems';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const {user, signOut } = useAuth();

  const handlePress = (item: typeof menuItems[0]) => {
    if (item.action === 'logout') {
      signOut();
    } else if (item.screen) {
      router.push(item.screen);
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background,
      paddingTop: insets.top + 20,
      paddingBottom: insets.bottom 
      }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Bienvenido
        </Text>
        <Text variant="titleLarge" style={[styles.welcomeText, { color: colors.primary }]}>
          {user?.username || 'Usuario'}
        </Text>
      </View>
      <FlatList
        data={menuItems}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: 'center' }}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              styles.card,
              { 
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <View style={styles.cardContent}>
              <IconButton
                icon={item.icon}
                mode="contained"
                size={40}
                style={[styles.button, { backgroundColor: "#00905f" }]}
                iconColor={colors.onPrimary}
              />
              <Text variant="titleMedium" style={styles.text}>
                {item.title}
              </Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
    marginBottom: 40
  },
  welcomeText: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden', // Para contener el efecto de presión
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    margin: 8,
    borderRadius: 12
  },
  text: {
    marginTop: 8,
    textAlign: 'center'
  }
});
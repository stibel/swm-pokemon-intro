import { View, Button, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery, useQueryClient } from 'react-query';
import {
  getValueFromAsyncStorage,
  removeValueFromAsyncStorage,
} from '@/utils/async_storage';
import { PokemonDetails } from '@/components/PokemonDetails';
import { Link } from 'expo-router';
import { screenView } from '@/components/styles/screen_view';

export default function HomeScreen() {
  const { data } = useQuery('favourite_pokemon', async () => {
    try {
      return await getValueFromAsyncStorage('favourite_pokemon');
    } catch (e) {
      console.error(e);
    }
  });

  const queryClient = useQueryClient();

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={screenView}>
        {data?.url ? (
          <>
            <Button
              title="Remove favourite"
              onPress={() => {
                removeValueFromAsyncStorage('favourite_pokemon');
                queryClient.invalidateQueries('favourite_pokemon');
              }}
            />
            <PokemonDetails url={data.url ?? ''} />
          </>
        ) : (
          <>
            <ThemedText
              style={styles.noFavourite}
            >
              No favourite pokemon yet
            </ThemedText>
            <Link
              href="/(tabs)/list"
              style={{ textAlign: 'center', fontSize: 16 }}
            >
              Find one in the list!
            </Link>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  noFavourite: {
    paddingTop: 24,
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 24,
  }
})
import { View, Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery, useQueryClient } from 'react-query';
import {
  getValueFromAsyncStorage,
  removeValueFromAsyncStorage,
} from '@/utils/async_storage';
import { PokemonDetails } from '@/components/PokemonDetails';

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
      <View
        style={{
          flex: 1,
          paddingVertical: 64,
          paddingHorizontal: 32,
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {data?.url ? (
          <>
            <Button
              title="Remove favourite"
              onPress={() => {
                removeValueFromAsyncStorage('favourite_pokemon');
                queryClient.invalidateQueries();
              }}
            />
            <PokemonDetails url={data.url ?? ''} />
          </>
        ) : (
          <ThemedText>No favourite pokemon yet</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

import { useQuery } from 'react-query';
import { ThemedText } from './ThemedText';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IPokemon } from '@/types/Pokemon';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { removeHyphens } from '@/utils/remove_hyphens';
import { capitalize } from '@/utils/capitalize';
import { useEffect } from 'react';

interface IPokemonDetailsProps {
  url: string;
}

export const PokemonDetails = ({ url }: IPokemonDetailsProps) => {
  const fetchPokemonDetails = async () => {
    const data = await fetch(url);
    return await data.json();
  };

  const { data, refetch } = useQuery<IPokemon>(
    'pokemon_details',
    fetchPokemonDetails,
  );

  useEffect(() => {
    refetch();
  }, [url, refetch]);

  return data ? (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <ThemedText style={styles.name}>{data.name.toUpperCase()}</ThemedText>
      </View>
      <Image
        style={{ height: 300, width: 300 }}
        height={475}
        width={475}
        src={data.sprites.other['official-artwork'].front_default}
      />
      <View style={styles.details}>
        <View style={{ display: 'flex' }}>
          <View>
            <ThemedText style={{ fontWeight: 'bold' }}>Abilities:</ThemedText>
            {data.abilities.map(({ ability }) => (
              <ThemedText key={ability.name}>
                {removeHyphens(capitalize(ability.name))}
              </ThemedText>
            ))}
          </View>
          <View style={{ marginTop: 16 }}>
            <ThemedText style={{ textAlign: 'left', fontWeight: 'bold' }}>
              Statistics:
            </ThemedText>
            {data.stats.map(({ stat, base_stat }) => (
              <ThemedText key={stat.name} style={{ textAlign: 'left' }}>
                {removeHyphens(capitalize(stat.name))}: {base_stat}
              </ThemedText>
            ))}
          </View>
        </View>
        <View>
          <ThemedText style={{ textAlign: 'right', fontWeight: 'bold' }}>
            Moves:
          </ThemedText>
          <ScrollView style={{ maxHeight: '60%' }}>
            {data.moves.map(({ move }) => (
              <ThemedText style={{ textAlign: 'right' }} key={move.name}>
                {removeHyphens(capitalize(move.name))}
              </ThemedText>
            ))}
          </ScrollView>
        </View>
      </View>
    </GestureHandlerRootView>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    maxHeight: '100%',
  },
  name: {
    paddingTop: 24,
    display: 'flex',
    alignItems: 'center',
    color: Colors.pokemonColors.red,
    fontWeight: 'bold',
    fontSize: 30,
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

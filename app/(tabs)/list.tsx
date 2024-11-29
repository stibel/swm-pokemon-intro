import React, { useEffect, useRef, useState } from 'react';
import { Button, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { ThemedText } from '@/components/ThemedText';
import { IPokemonListItem } from '@/types/PokemonListItem';
import { IPaginatedResponse } from '@/types/PaginatedReponse';

import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PokemonDetails } from '@/components/PokemonDetails';
import { storeValueInAsyncStorage } from '@/utils/async_storage';
import { capitalize } from '@/utils/capitalize';
import { getSpritePath } from '@/utils/get_sprite_path';
import { getPokemonIdFromUrl } from '@/utils/get_pokemon_id_from_url';
import FastImage from 'react-native-fast-image';
import { screenView } from '@/components/styles/screen_view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface IPokemonItemProps {
  pokemon: IPokemonListItem;
  onShowDetails: (url: string) => void;
}

export const PokemonItem = ({
  pokemon: { name, url },
  onShowDetails,
}: IPokemonItemProps) => {
  return (
    <Pressable
      onPress={() => onShowDetails(url)}
      style={styles.pokemonListItem}
    >
      <ThemedText
        style={styles.pokemonName}
      >
        {capitalize(name)}
      </ThemedText>
      <FastImage
        style={{ height: 80, width: 80 }}
        source={{
          uri: getSpritePath(getPokemonIdFromUrl(url)),
          priority: 'low',
        }}
      />
    </Pressable>
  );
};

export default function List() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [activePokemonUrl, setActivePokemonUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const fetchPokemon = async (
    offset: number = 0,
  ): Promise<IPaginatedResponse<IPokemonListItem>> => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
    );
    return await response.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch,
  } = useInfiniteQuery<IPaginatedResponse<IPokemonListItem>>(
    'pokemons',
    ({ pageParam = 0 }) => fetchPokemon(pageParam),
    {
      getNextPageParam: (lastPage) => {
        const nextOffset = lastPage.next
          ? new URLSearchParams(lastPage.next.split('?')[1]).get('offset')
          : undefined;
        return nextOffset ? parseInt(nextOffset, 10) : undefined;
      },
    },
  );

  const onShowDetails = (url: string) => {
    setActivePokemonUrl(url);
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={screenView}>
        {error ? (
          <div>
            <ThemedText>Error has occured!</ThemedText>
            <Button title="Try again" onPress={() => refetch()} />
          </div>
        ) : (
          <FlatList
            scrollEnabled
            data={data?.pages.flatMap((page) => page.results)}
            renderItem={({ item }) => (
              <PokemonItem pokemon={item} onShowDetails={onShowDetails} />
            )}
            keyExtractor={({ name }) => name}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            refreshing={Boolean(status) && status === 'loading'}
            onRefresh={refetch}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ThemedText>Fetching more...</ThemedText>
              ) : null
            }
          />
        )}
      </View>

      <BottomSheet ref={bottomSheetRef} snapPoints={['25%', '50%', '90%']}>
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <View>
            <View
              style={styles.sheetButtonsWrapper}
            >
              <Pressable
                onPress={() => {
                  storeValueInAsyncStorage(
                    'favourite_pokemon',
                    activePokemonUrl ?? '',
                  );
                  queryClient.invalidateQueries('favourite_pokemon');
                }}
              >
                <IconSymbol
                  size={50}
                  name="heart.circle.fill"
                  color={Colors.pokemonColors.red}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setActivePokemonUrl(null);
                  bottomSheetRef.current?.close();
                }}
              >
                <IconSymbol
                  size={50}
                  name="xmark.circle.fill"
                  color={Colors.pokemonColors.red}
                />
              </Pressable>
            </View>
            {activePokemonUrl && <PokemonDetails url={activePokemonUrl} />}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  pokemonListItem: {
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.pokemonColors.red,
  },
  pokemonName: {
    color: Colors.pokemonColors.ivory,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 24,
  },
  sheetButtonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  }
})
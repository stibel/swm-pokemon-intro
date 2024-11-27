import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IPaginatedResponse } from '@/types/PaginatedReponse';
import { IPokemonListItem } from '@/types/PokemonListItem';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import { useInfiniteQuery } from 'react-query';
import { PokemonItem } from './list';
import { getSpritePath } from '@/utils/get_sprite_path';
import { getPokemonIdFromUrl } from '@/utils/get_pokemon_id_from_url';

export default function MapScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [pokemon, setPokemon] = useState<string | null>()

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

  const mapHTML = `
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style type="text/css">
        #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([51.5, -0.09]).addTo(map)
          .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
          .openPopup();

          function onMapClick(e) {
      L.marker(e.latlng).addTo(map)
        .bindPopup("<img src='${pokemon}' alt='pokemon' />")
        .openPopup();
    }

    map.on('click', onMapClick);
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        <WebView originWhitelist={['*']} source={{ html: mapHTML }} />
      </View>

      <BottomSheet ref={bottomSheetRef}
        snapPoints={['25%', '50%', '90%']}
      >
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <FlatList
            scrollEnabled
            data={data?.pages.flatMap((page) => page.results)}
            renderItem={({ item }) => (
              <PokemonItem pokemon={item} onShowDetails={(url) => setPokemon(getSpritePath(getPokemonIdFromUrl(url)))} />
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
        </BottomSheetView></BottomSheet>
    </GestureHandlerRootView>)
};

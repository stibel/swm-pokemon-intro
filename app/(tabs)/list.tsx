import React from 'react';
import { Button, FlatList, View } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { ThemedText } from '@/components/ThemedText';
import { IPokemon } from '@/types/Pokemon';
import { IPaginatedResponse } from '@/types/PaginatedReponse';

import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

const PokemonItem = ({ name, url }: IPokemon) => {
    return (
        <View style={{
            marginBottom: 8,
            paddingHorizontal: 8,
            height: 40,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: Colors.pokemonColors.red,
        }}>
            <ThemedText style={{ color: Colors.pokemonColors.ivory, fontWeight: 'bold' }}>
                {name.replace(name[0],
                    name[0].toUpperCase())}
            </ThemedText>
            <IconSymbol style={{ cursor: 'pointer' }} size={28} name="eye.fill" color={Colors.pokemonColors.ivory} />
        </View>
    )
}

export default function ProfileScreen() {
    const fetchPokemon = async (offset: number = 0): Promise<IPaginatedResponse<IPokemon>> => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        return await response.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
        refetch
    } = useInfiniteQuery<IPaginatedResponse<IPokemon>>('pokemons', ({ pageParam = 0 }) => fetchPokemon(pageParam), {
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.next ? new URLSearchParams(lastPage.next.split('?')[1]).get('offset') : undefined;
            return nextOffset ? parseInt(nextOffset, 10) : undefined;
        }
    });

    return (
        <ThemedView style={{ flex: 1 }}>
            <View style={{
                flex: 1,
                paddingVertical: 64,
                paddingHorizontal: 32,
                gap: 16,
                overflow: 'hidden',
            }}>
                {error ? <div>
                    <ThemedText>Error has occured!</ThemedText>
                    <Button title="Try again" onPress={() => refetch()} />
                </div> :
                    <FlatList
                        scrollEnabled
                        data={data?.pages.flatMap(page => page.results)}
                        renderItem={({ item }) => <PokemonItem {...item} />}
                        keyExtractor={({ name }) => name}
                        onEndReached={() => {
                            if (hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                        refreshing={Boolean(status) && status === 'loading'}
                        onRefresh={refetch}
                        ListFooterComponent={isFetchingNextPage ? <ThemedText>Fetching more...</ThemedText> : null}
                    />
                }
            </View>
        </ThemedView>
    );
}
import React from 'react';
import { Button, FlatList, View } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { ThemedText } from '@/components/ThemedText';
import { IPokemon } from '@/types/Pokemon';
import { IPaginatedResponse } from '@/types/PaginatedReponse';

import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const PokemonItem = ({ name, url }: IPokemon) => {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors.misc.pokemonRed,
            borderRadius: 5,
            marginBottom: 8,
            paddingHorizontal: 8
        }}>
            <ThemedText>
                {name.replace(name[0],
                    name[0].toUpperCase())}
            </ThemedText>
            <ThemedText>czeker out</ThemedText>
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
                        ListFooterComponent={isFetchingNextPage ? <ThemedText>Fetching more...</ThemedText> : null}
                    />
                }
            </View>
        </ThemedView>
    );
}
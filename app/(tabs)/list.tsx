import React, { useEffect } from 'react';
import { Animated, FlatList, Text } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { ThemedText } from '@/components/ThemedText';
import { IPokemon } from '@/types/Pokemon';
import { IPaginatedResponse } from '@/types/PaginatedReponse';

import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native-reanimated/lib/typescript/Animated';


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
        error
    } = useInfiniteQuery<IPaginatedResponse<IPokemon>>('pokemons', ({ pageParam = 0 }) => fetchPokemon(pageParam), {
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.next ? new URLSearchParams(lastPage.next.split('?')[1]).get('offset') : undefined;
            return nextOffset ? parseInt(nextOffset, 10) : undefined;
        }
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <ThemedView style={{ flex: 1 }}>
            <Animated.View style={{
                flex: 1,
                paddingVertical: 64,
                paddingHorizontal: 32,
                gap: 16,
                overflow: 'hidden',
            }}>
                <FlatList
                    data={data?.pages.flatMap(page => page.results)}
                    renderItem={({ item }) => <Text>{item.name}</Text>}
                    keyExtractor={({ name }) => name}
                />
            </Animated.View>
        </ThemedView>
    );
}
import React, { act, useState } from 'react';
import { Button, FlatList, Modal, Pressable, View } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { ThemedText } from '@/components/ThemedText';
import { IPokemonListItem } from '@/types/PokemonListItem';
import { IPaginatedResponse } from '@/types/PaginatedReponse';

import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PokemonDetails } from '@/components/PokemonDetails';
import { storeValueInAsyncStorage } from '@/utils/async_storage';
import { capitalize } from '@/utils/capitalize';

interface IPokemonItemProps {
    pokemon: IPokemonListItem,
    onShowDetails: (url: string) => void
}

const PokemonItem = ({ pokemon: { name, url }, onShowDetails }: IPokemonItemProps) => {
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
                {capitalize(name)}
            </ThemedText>
            <Pressable onPress={() => onShowDetails(url)}>
                <IconSymbol size={28} name="eye.fill" color={Colors.pokemonColors.ivory} />
            </Pressable>
        </View>
    )
}

export default function ProfileScreen() {

    const [activePokemonUrl, setActivePokemonUrl] = useState<string | null>(null);

    const fetchPokemon = async (offset: number = 0): Promise<IPaginatedResponse<IPokemonListItem>> => {
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
    } = useInfiniteQuery<IPaginatedResponse<IPokemonListItem>>('pokemons', ({ pageParam = 0 }) => fetchPokemon(pageParam), {
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
                        renderItem={({ item }) => <PokemonItem pokemon={item} onShowDetails={setActivePokemonUrl} />}
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

            <Modal
                visible={Boolean(activePokemonUrl)}
                onRequestClose={() => setActivePokemonUrl(null)}
            >
                <View
                    style={{
                        paddingVertical: 64,
                        paddingHorizontal: 32,
                    }}
                >
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignSelf: 'flex-end'
                    }}>
                        <Pressable onPress={() => storeValueInAsyncStorage('favourite_pokemon', activePokemonUrl ?? "")}>
                            <IconSymbol size={50} name="heart.circle.fill" color={Colors.pokemonColors.red} />
                        </Pressable>
                        <Pressable onPress={() => setActivePokemonUrl(null)}>
                            <IconSymbol size={50} name="xmark.circle.fill" color={Colors.pokemonColors.red} />
                        </Pressable>
                    </View>
                    {activePokemonUrl && <PokemonDetails url={activePokemonUrl} />}
                </View>
            </Modal>
        </ThemedView>
    );
}
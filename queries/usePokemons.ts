import { IPaginatedResponse } from '@/types/PaginatedReponse';
import { IPokemonListItem } from '@/types/PokemonListItem';
import { useInfiniteQuery } from 'react-query';

const fetchPokemon = async (
  offset: number = 0,
): Promise<IPaginatedResponse<IPokemonListItem>> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`,
  );
  return await response.json();
};

export const usePokemons = () =>
  useInfiniteQuery<IPaginatedResponse<IPokemonListItem>>(
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

import { useQuery } from "react-query";
import { ThemedText } from "./ThemedText";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { Colors } from "@/constants/Colors";

interface IPokemonDetailsProps {
    url: string;
}

export const PokemonDetails = ({ url }: IPokemonDetailsProps) => {

    const fetchPokemonDetails = async () => {
        const data = await fetch(url);
        return await data.json();
    }

    const { data } = useQuery('pokemon_details', fetchPokemonDetails);

    useEffect(() => {
        console.log(data && data.sprites.other["official-artwork"].front_default)
    }, [data])

    return (
        <View>
            <ThemedText style={{
                paddingTop: 36,
                color: Colors.pokemonColors.red,
                fontWeight: 'bold',
                fontSize: 30
            }}>
                {data && data.name.toUpperCase()}
            </ThemedText>
            <Image style={{ height: 300, width: 300 }} height={475} width={475} src={data.sprites.other["official-artwork"].front_default} />
        </View>
    );
}
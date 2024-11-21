interface AbilityInfo {
  name: string;
  url: string;
}

interface Ability {
  ability: AbilityInfo;
  is_hidden: boolean;
  slot: number;
}

interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

interface MoveInfo {
  name: string;
  url: string;
}

interface VersionGroup {
  name: string;
  url: string;
}

interface MoveLearnMethod {
  name: string;
  url: string;
}

interface MoveDetail {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
}

interface Move {
  move: MoveInfo;
  version_group_details: MoveDetail[];
}

interface SpriteVersions {
  front_default: string;
  front_shiny: string;
}

interface SpriteGroup {
  'generation-i'?: {
    'red-blue'?: SpriteVersions;
    yellow?: SpriteVersions;
  };
  // Similarly for other generations
  'generation-viii'?: {
    icons: SpriteVersions;
  };
}

interface Sprites {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
  other: {
    home: SpriteVersions;
    'official-artwork': SpriteVersions;
  };
  versions?: SpriteGroup;
}

interface StatInfo {
  name: string;
  url: string;
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: StatInfo;
}

interface TypeInfo {
  name: string;
  url: string;
}

interface Type {
  slot: number;
  type: TypeInfo;
}

export interface IPokemon {
  abilities: Ability[];
  base_experience: number;
  forms: { name: string; url: string }[];
  game_indices: GameIndex[];
  height: number;
  id: number;
  moves: Move[];
  name: string;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

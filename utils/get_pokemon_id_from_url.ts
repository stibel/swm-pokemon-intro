export const getPokemonIdFromUrl = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 2];
};

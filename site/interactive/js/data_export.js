const N = 500;

// Get the data
export const pointsObj = {
  ...(await d3.json('/interactive/data/2.5k_pca_log_adjusted.json')),
};
export const points = Object.entries(pointsObj).slice(0, N);
// TODO: cache this up in localStorage, it's only ~1MB
export const artistData = {
  ...(await d3.json('/interactive/data/2.5k_artist_data.json')),
};
export const genreMap = {
  ...(await d3.json('/interactive/data/genre_map.json')),
};

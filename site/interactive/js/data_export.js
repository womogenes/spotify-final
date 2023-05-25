const N = 2500;

const artistDataArr = Object.entries({
  ...(await d3.json('/interactive/data/2.5k_artist_data.json')),
}).slice(0, N);
const includedArtists = artistDataArr.slice(0, N).map((a) => a[0]);

export const artistData = Object.fromEntries(artistDataArr);

// Get the data
const pointsObjAll = {
  ...(await d3.json('/interactive/data/2.5k_pca_log_adjusted.json')),
};
export const pointsObj = Object.fromEntries(
  includedArtists.map((a) => {
    return [a, pointsObjAll[a]];
  })
);

export const points = includedArtists.map((a) => [a, pointsObj[a]]);

export const genreMap = {
  ...(await d3.json('/interactive/data/genre_map.json')),
};

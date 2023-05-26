// Map every genre to a color
import Color from 'https://colorjs.io/dist/color.js';
import { artistData, genreMap } from './data_export.js';

// "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
// "#ea5545", "#f46a9b", "#8c564b", "#ef9b20", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"

let bigGenreColors = {
  'hip hop': '#ea5545',
  rap: '#f46a9b',
  edm: '#ef9b20',
  indie: '#d9cd48',
  soul: '#86cf32',
  jazz: '#87bc45',
  rock: '#27aeef',
  country: '#b33dc6',
  pop: '#7f7f7f',
  other: '#eeeeee',
};

const pickBigGenre = (genreList) => {
  const bigGenres = new Set(genreList.map((g) => genreMap[g]));
  for (let bigGenre in bigGenreColors) {
    if (bigGenres.has(bigGenre)) return bigGenre;
  }
};
window.pickBigGenre = pickBigGenre;

const genreColor = (genre) => {
  return Object.keys(bigGenreColors).includes(genreMap[genre])
    ? bigGenreColors[genreMap[genre]]
    : '#eeeeee';
};
window.genreColor = genreColor;

export const genreLegend = Object.entries(bigGenreColors);

export { pickBigGenre, genreColor };

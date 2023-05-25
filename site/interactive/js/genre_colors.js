// Map every genre to a color
import Color from 'https://colorjs.io/dist/color.js';
import { artistData, genreMap } from './data_export.js';

// "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"

let bigGenreColors = {
  'hip hop': '#f542cb',
  rap: '#9467bd',
  pop: '#4256ed',
  edm: '#2b7fed',
  indie: '#0dd0d4',
  soul: '#1dc70e',
  jazz: '#afd40d',
  rock: '#fcba03',
  country: '#d62215',
  other: '#eeeeee',
};

const pickBigGenre = (genreList) => {
  return genreMap[genreList.find((g) => genreMap[g] !== 'other')] || 'other';
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

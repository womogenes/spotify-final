// Map every genre to a color
import Color from 'https://colorjs.io/dist/color.js';
import { artistData, genreMap } from './data_export.js';

// "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
// "#ea5545", "#f46a9b", "#8c564b", "#ef9b20", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"

let bigGenreColors = {
  'hip hop': '#ea5545',
  rap: '#f46a9b',
  pop: '#8c564b',
  edm: '#ef9b20',
  indie: '#ede15b',
  soul: '#bdcf32',
  jazz: '#87bc45',
  rock: '#27aeef',
  country: '#b33dc6',
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

// Initialize the svg
let width = 720,
  height = 720;
let initStroke = 1;

const svg = d3
  .select('#visualization')
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [-50, -45, 100, 100]);

const g = svg
  .append('g')
  .attr('fill', 'none')
  .attr('stroke-linecap', 'round')
  .attr('stroke-width', initStroke);

const onZoom = (e) => {
  let zoomLevel = e.transform.k;
  let strokeWidth;
  if (zoomLevel < 8) {
    strokeWidth = initStroke;
  } else {
    // Super zoomed-in, can use some detail
    strokeWidth = 0.9;

    // renderPoints();
  }

  g.attr('transform', e.transform)
    .transition(300)
    .attr('stroke-width', strokeWidth);
  d3.select('#zoom-level').text(`${e.transform.k.toFixed(2)}x`);
};
let zoom = d3.zoom().scaleExtent([1, 15]).on('zoom', onZoom);

// Initialize zoom
svg.call(zoom);

// Get the data
let points = Object.entries(await d3.json('data/2.5k_pca_log.json')).slice(
  0,
  2500
);
let artistData = await d3.json('data/2.5k_artist_data.json');
console.log('artistData obtained!');
// TODO: cache this up, it's only ~1MB

// TODO: don't hard-code this
const topGenres = [
  'other',
  'rock',
  'pop',
  'classic rock',
  'rap',
  'dance pop',
  'album rock',
  'modern rock',
  'indietronica',
  'hip hop',
  'soft rock',
  'contemporary country',
  'alternative metal',
];
let genreColor = d3.scaleOrdinal([
  '#dddddd80',
  '#fcba03',
  '#32a852',
  ...d3.schemeCategory10,
]);
genreColor.domain(topGenres);
let genreLegend = genreColor.domain().map((x) => [x, genreColor(x)]);

// Plot key in the debug box
d3.select('#legend')
  .selectAll('div')
  .data(genreLegend)
  .join('div')
  .attr('class', 'legend-item');
d3.selectAll('.legend-item')
  .style('margin-bottom', '10px')
  .style('display', 'flex')
  .style('align-items', 'center')
  .style('gap', '5px')
  .append('span')
  .style('width', '10px')
  .style('height', '10px')
  .style('display', 'block')
  .style('border-radius', '9999px')
  .style('background-color', (d) => d[1]);
d3.selectAll('.legend-item')
  .append('span')
  .text((d) => d[0]);

const renderPoints = () => {
  g.selectAll('path')
    .data(points)
    .join('path')
    .attr('d', (d) => `M${d[1][0]},${d[1][1]}Z`)
    .attr('stroke', (d) => {
      const artistID = d[0];
      const mainGenre = artistData[artistID]['main_genre'];

      return genreColor(mainGenre);
    });
};

renderPoints();

// Figure out what .join actually does (enter, exit, etc.)
// https://www.d3indepth.com/zoom-and-pan/
// https://stackoverflow.com/questions/44682515/mouseover-only-on-path-in-d3

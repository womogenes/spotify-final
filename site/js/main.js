// Initialize the svg
let width = 720,
  height = 720;
const svg = d3
  .select('#visualization')
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [-50, -50, 100, 100]);
const g = svg.append('g');

const onZoom = (e) => {
  g.attr('transform', e.transform);
};
let zoom = d3.zoom().on('zoom', onZoom);

// Initialize zoom
svg.call(zoom);

// Get the data
let data = Object.entries(await d3.json('data/2.5k_pca_log.json'));
g.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('cx', (d) => d[1][0])
  .attr('cy', (d) => d[1][1])
  .attr('r', 0.1);

// https://stackoverflow.com/questions/44682515/mouseover-only-on-path-in-d3

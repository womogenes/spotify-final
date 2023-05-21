import { luma, mobileCheck } from './utils.js';

let initStroke = 1;

// Initialize the svg
const svg = d3
  .select('#visualization')
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', [-50, -45, 100, 100]);

const g = svg
  .append('g')
  .attr('stroke-linecap', 'round')
  .attr('stroke-width', initStroke);

const getCurTransform = () => {
  // Grab current transform
  let curX, curY, curScale;
  const { baseVal } = g.node().transform;
  if (baseVal.length > 0) {
    const { matrix } = baseVal.getItem(0);
    (curX = matrix.e), (curY = matrix.f);
  } else {
    (curX = 0), (curY = 0);
  }
  curScale = baseVal.length >= 1 ? baseVal.getItem(1).matrix.a : 1;

  return [curX, curY, curScale];
};

const onZoom = async (e) => {
  const zoomLevel = e.transform.k;
  const threshold = 5;
  const [, , prevZoom] = getCurTransform();

  if (zoomLevel > threshold && prevZoom <= threshold) {
    // Surpassed threshold
    g.selectAll('image')
      .transition(100)
      .style('opacity', 1)
      .style('display', '');
  } else if (zoomLevel <= threshold && prevZoom > threshold) {
    // De-surpassed threshold
    g.selectAll('image').style('opacity', 0).style('display', 'none');
  }

  g.attr('transform', e.transform);
  d3.select('#zoom-level').text(`${zoomLevel.toFixed(2)}x`);
};

const zoom = d3.zoom().scaleExtent([0.75, 40]).on('zoom', onZoom);

// Initialize zoom
svg.call(zoom);

window.zoomToArtist = (id) => {
  // Utility function for zooming to artist
  // https://observablehq.com/@d3/programmatic-zoom
  let toTransform = pointsObj[id];

  svg
    .transition()
    .delay(250)
    .duration(1500)
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(10).translate(-toTransform[0], -toTransform[1]),
      [toTransform[0], toTransform[1]]
    );
};

// Get the data
const pointsObj = { ...(await d3.json('data/2.5k_pca_log.json')) };
const points = Object.entries(pointsObj).slice(0, 500);
// TODO: cache this up in localStorage, it's only ~1MB
let artistData = await d3.json('data/2.5k_artist_data.json');

// Colors
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
  '#eb4034',
  ...d3.schemeCategory10,
]);
genreColor.domain(topGenres);
let genreLegend = genreColor.domain().map((x) => [x, genreColor(x)]);

// Plot key in the debug box
d3.select('#legend')
  .selectAll('div')
  .data(genreLegend)
  .join('div')
  .attr('class', 'legend-item')
  .on('mouseover', function (e, d) {
    d3.select(this).style('background-color', '#00000020');
    g.selectAll('g').each(function (itemData) {
      if (artistData[itemData[0]]['main_genre'] !== d[0]) {
        d3.select(this).attr('opacity', 0.05);
      }
    });
  })
  .on('mouseout', function (e) {
    d3.select(this).style('background-color', '');
    g.selectAll('g').each(function () {
      d3.select(this).attr('opacity', 1);
    });
  });

d3.selectAll('.legend-item')
  .append('span')
  .attr('class', 'legend-color')
  .style('background-color', (d) => d[1]);
d3.selectAll('.legend-item')
  .append('span')
  .text((d) => d[0]);

// Main rendering
let avatar_size = 0.5;

// Universal clip path for images
g.append('clipPath')
  .attr('id', 'avatarClipObj')
  .append('circle')
  .attr('cx', avatar_size / 2)
  .attr('cy', avatar_size / 2)
  .attr('r', avatar_size / 2);

// Tooltip element
let tooltip = d3.select('#tooltip');
if (!mobileCheck()) {
  // Following around mouse is only necessary on systems with mouse
  d3.select('#visualization').on('mousemove', function (e) {
    return tooltip
      .style('top', e.pageY - 10 + 'px')
      .style('left', e.pageX + 10 + 'px');
  });
}

window.renderPoints = (r) => {
  g.style('opacity', 0);

  g.selectAll('g')
    .data(points)
    .join('g')
    .attr('transform', (d) => `translate(${d[1][0]},${d[1][1]})`)
    .attr('id', (d) => `g_${d[0]}`)
    .each(function (d) {
      // Construct circle and image
      const artistID = d[0];
      const data = artistData[artistID];
      const mainGenre = data['main_genre'];
      const avatarURL = data['images'][2]?.url;
      data['bio'] = data['bio'];

      d3.select(this)
        .append('circle')
        .attr('r', r)
        .attr('fill', genreColor(mainGenre))
        .on('mouseover', (e) => {
          tooltip.select('.title').text(data['name']);
          tooltip.style('display', 'block');
          tooltip
            .select('.tags')
            .style('margin-top', data['genres'].length > 0 ? '0.5em' : '0')
            .selectAll('span')
            .data(data['genres'])
            .join('span')
            .each(function (genre) {
              let bgColor = genreColor.domain().includes(genre)
                ? genreColor(genre)
                : '#dddddd';

              let lightness = luma(bgColor);

              d3.select(this)
                .attr('class', 'genre-tag')
                .style('background-color', bgColor)
                .style('color', lightness < 0.8 ? '#fff' : '#000')
                .text((d) => d);
            });

          return tooltip.transition(300).style('opacity', 1);
        })
        .on('mouseout', (e) => {
          tooltip.transition(300).style('opacity', 0);
        })
        .on('click', (e) => {
          zoomToArtist(artistID);
        });

      if (!avatarURL) return;
      d3.select(this)
        .append('image')
        .attr('xlink:href', avatarURL)
        .style('opacity', 0)
        .style('display', 'none')
        .attr('width', avatar_size)
        .attr('height', avatar_size)
        .attr('transform', `translate(${-avatar_size / 2},${-avatar_size / 2})`)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('clip-path', 'url(#avatarClipObj)')
        .style('pointer-events', 'none');
    });

  console.log('loaded');
  g.transition(300).style('opacity', 1);
};

renderPoints(0.3);

// Figure out what .join actually does (enter, exit, etc.)
// https://www.d3indepth.com/zoom-and-pan/
// https://stackoverflow.com/questions/44682515/mouseover-only-on-path-in-d3

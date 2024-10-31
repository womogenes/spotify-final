import { luma, mobileCheck } from './utils.js';
import { pointsObj, points, artistData } from './data_export.js';
import { genreLegend, genreColor, pickBigGenre } from './genre_colors.js';

// Initialize the svg
const svg = d3
  .select('#visualization')
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', [-50, -45, 100, 100]);

const g = svg.append('g');

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

// Zooming stuff
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

window.onSearchSubmit = (name) => {
  if (!name) return;

  // Name passed via Alpine magic
  let obj = Object.entries(artistData).find(([id, data]) =>
    data['name'].toLowerCase().includes(name.toLowerCase())
  );
  if (!obj) return; // Not found

  zoomToArtist(obj[0]);
};

const createGenreTags = (container, genres) => {
  container
    .select('.tags')
    .selectAll('span')
    .data(genres)
    .join('span')
    .each(function (genre) {
      let bgColor = genreColor(genre);
      let lightness = luma(bgColor);

      d3.select(this)
        .attr('class', 'genre-tag')
        .style('background-color', bgColor)
        .style('color', lightness < 0.7 ? '#fff' : '#000')
        .text((d) => d);
    });
};

window.setZoomPan = (coords, scale) => {
  svg
    .transition()
    .duration(1500)
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(scale).translate(-coords[0], -coords[1]),
      coords
    );
};

window.zoomToArtist = (id) => {
  // Utility function for zooming to artist
  // https://observablehq.com/@d3/programmatic-zoom
  let toTransform = pointsObj[id];
  setZoomPan(toTransform, 20);

  // Prep the box
  const box = d3.select('#artist-container');
  const data = artistData[id];

  d3.select('#artist-container')
    .style('visibility', 'visible')
    .transition(300)
    .style('opacity', 1);

  box
    .select('img')
    .attr('src', data['images'][0]['url'])
    .attr('alt', `Profile im age of ${data['name']}`);
  box.select('.name').text(data['name']);
  createGenreTags(box, data['genres']);
  box
    .select('.info .spotify-href a')
    .attr('href', data['external_urls']['spotify']);
  // box.select('.info .popularity').text(`Popularity: ${data['popularity']}`);
  box
    .select('.info .followers')
    .text(`${data['followers']['total'].toLocaleString()} followers`);

  box
    .select('.bio span')
    .html(
      data['bio']
        .replace('".', '."')
        .replace('",', ',"')
        .replace(' ,', ',')
        .replace(' .', '.')
    )
    .select('a')
    .attr('target', '_blank');
  document.querySelector('#artist-container .bio').scrollTop = 0; // Reset scroll on bio for mobile
};

// Settings: # of artists
const nArtistsButtons = d3.selectAll('#n-artists-selection input');
nArtistsButtons.on('change', function (e, d) {
  let n = parseInt(e.target.value);
  localStorage.setItem('n-artists', n);

  // Re-render points
  console.log(`rerendering with ${n} points`);
  renderPoints(n);
});

// Plot key in the debug box
d3.select('#legend')
  .selectAll('div')
  .data(genreLegend)
  .join('div')
  .attr('class', 'legend-item')
  .attr('tabindex', '0');

window.highlightArtists = (condition, on, off) => {
  // Condition takes in an artist id and returns a boolean
  g.selectAll('g').each(function (itemData) {
    d3.select(this)
      .transition(300)
      .attr('opacity', condition(itemData[0]) ? on : off);
  });
};

const encodeGenre = (genre) => {
  return genre.replace(' ', '-');
};

d3.selectAll('.legend-item')
  .append('input')
  .attr('type', 'radio')
  .attr('id', (d) => `legend-genre-${encodeGenre(d[0])}`)
  .attr('name', 'genre-select')
  .attr('value', (d) => d[0])
  .style('visibility', 'hidden')
  .style('position', 'absolute');

d3.selectAll('.legend-item')
  .append('label')
  .attr('for', (d) => `legend-genre-${encodeGenre(d[0])}`)
  .append('span')
  .attr('class', 'legend-color')
  .style('background-color', (d) => d[1]);
d3.selectAll('.legend-item label')
  .append('span')
  .text((d) => d[0]);

const selectGenre = function (e, d) {
  e.preventDefault();

  const inputEl = d3.select(`#legend-genre-${encodeGenre(d[0])}`);

  if (inputEl.node().checked) {
    // Deselect
    inputEl.node().checked = false;
    highlightArtists(() => true, 1, 1);
  } else {
    inputEl.node().checked = true;
    highlightArtists(
      (id) => pickBigGenre(artistData[id]['genres']) === d[0],
      1,
      0.05
    );
  }
};
d3.selectAll('.legend-item label').on('click', selectGenre);
d3.selectAll('.legend-item').on('keypress', function (e, d) {
  if (e.key === 'Enter') selectGenre(e, d);
});

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
      .style('top', e.clientY - 10 + 'px')
      .style('left', e.clientX + 10 + 'px');
  });
}

window.renderPoints = (N) => {
  const createGroup = (enter) => {
    const gs = enter
      .append('g')
      .attr('transform', (d) => `translate(${d[1][0]},${d[1][1]})`)
      .attr('id', (d) => `g_${d[0]}`)
      .style('cursor', 'pointer')
      .attr('opacity', 1)
      .each(function (d) {
        // Construct circle and image
        const artistID = d[0];
        const data = artistData[artistID];
        const mainGenre = pickBigGenre(data['genres']);
        const avatarURL = data['images'][2]?.url;
        data['bio'] = data['bio'];

        d3.select(this)
          .append('circle')
          .attr('r', 0.3)
          .attr('fill', genreColor(mainGenre))
          .on('mouseover', (e) => {
            if (mobileCheck()) return;

            tooltip.select('.title').text(data['name']);
            tooltip.style('display', 'block');
            createGenreTags(tooltip, data['genres']);

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
          .attr(
            'transform',
            `translate(${-avatar_size / 2},${-avatar_size / 2})`
          )
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .attr('clip-path', 'url(#avatarClipObj)')
          .style('pointer-events', 'none');
      });

    gs.transition(300).attr('opacity', 1);
  };

  g.selectAll('g')
    .data(points.slice(0, N), (d) => d[0])
    .join(
      createGroup,
      (update) => {},
      (exit) =>
        exit
          .transition(300)
          .attr('opacity', 0)
          .on('end', function () {
            this.remove();
          })
    );

  d3.select('.loading-text').remove();
};

g.style('opacity', 0);

let N = localStorage.getItem('n-artists') || 500;
document.querySelector(`#n-${N}-artists`).checked = true;

window.setTimeout(
  () => {
    renderPoints(N);
    g.transition(300).style('opacity', 1);
  },
  mobileCheck() ? 2000 : 0
);

// Figure out what .join actually does (enter, exit, etc.)
// https://www.d3indepth.com/zoom-and-pan/
// https://stackoverflow.com/questions/44682515/mouseover-only-on-path-in-d3

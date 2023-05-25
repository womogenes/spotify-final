const katex = require('katex');
const markdownIt = require('markdown-it');
const mdIterator = require('markdown-it-for-inline');
const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('interactive/js');
  eleventyConfig.addPassthroughCopy('interactive/data');
  eleventyConfig.addPassthroughCopy('images');

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Math support for markdown
  const latex = (content) => {
    // https://benborgers.com/posts/eleventy-katex
    const cleanEquation = (equation) =>
      equation.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

    const displayRegex = /\$\$\s*(.+?)\s*\$\$/g;
    const inlineRegex = /\$\s*(.+?)\s*\$/g;

    return content
      .replace(displayRegex, (_, equation) => {
        return katex.renderToString(cleanEquation(equation), {
          throwOnError: false,
          displayMode: true,
        });
      })
      .replace(inlineRegex, (_, equation) => {
        return katex.renderToString(cleanEquation(equation), {
          throwOnError: false,
          displayMode: false,
        });
      })
      .replace(/\s+--\s+/g, '&mdash;');
  };

  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(mdIterator, 'url_new_win', 'link_open', function (tokens, idx) {
    // https://v2.franknoirot.co/posts/external-links-markdown-plugin/
    const [attrName, href] = tokens[idx].attrs.find(
      (attr) => attr[0] === 'href'
    );

    if (href && !href.startsWith('/') && !href.startsWith('#')) {
      tokens[idx].attrPush(['target', '_blank']);
      tokens[idx].attrPush(['rel', 'noopener noreferrer']);
    }
  });

  eleventyConfig.setLibrary('md', {
    render: (source) => latex(md.render(source)),
  });
};

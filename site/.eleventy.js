const katex = require('katex');
const markdownIt = require('markdown-it');
const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('interactive/js');
  eleventyConfig.addPassthroughCopy('interactive/data');

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
  });
  eleventyConfig.setLibrary('md', {
    render: (source) => latex(md.render(source)),
  });
};

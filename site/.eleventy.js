const katex = require('katex');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('interactive/js');
  eleventyConfig.addPassthroughCopy('interactive/data');

  eleventyConfig.addFilter('latex', (content) => {
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
      });
  });
};

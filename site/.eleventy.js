const { EleventyRenderPlugin } = require('@11ty/eleventy');
const markdownIt = require('markdown-it');
const mk = require('markdown-it-katex');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('interactive/js');
  eleventyConfig.addPassthroughCopy('interactive/data');

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Markdown rendering options
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });
  md.use(mk);
  eleventyConfig.setLibrary('md', md);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('interactive/js');
  eleventyConfig.addPassthroughCopy('interactive/data');
};

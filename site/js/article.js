// Inject Markdown!
const content = await (await fetch('../writing_stuff/about_data.md')).text();
document.querySelector('#article-container').innerHTML = marked.parse(content);

renderMathInElement(document.body, {
  // customised options
  // auto-render specific keys, e.g.:
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true },
  ],
  // rendering keys, e.g.:
  throwOnError: false,
});

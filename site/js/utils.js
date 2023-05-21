const luma = (hexString) => {
  // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
  // Input hex string, output float

  hexString = hexString.substring(1); // strip #
  let rgb = parseInt(hexString, 16); // convert rrggbb to decimal
  let r = (rgb >> 16) & 0xff; // extract red
  let g = (rgb >> 8) & 0xff; // extract green
  let b = (rgb >> 0) & 0xff; // extract blue

  return (0.299 * r + 0.587 * g + 0.114 * b) / 255; // per ITU-R BT.709
};

window.luma = luma;
export { luma };

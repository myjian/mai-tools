export function roundFloat(num, method, unit) {
  return Math[method](unit * num) / unit;
}

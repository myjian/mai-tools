export function compareNumber(a: number, b: number) {
  return a > b ? 1 : a < b ? -1 : 0;
}

export function roundFloat(num: number, method: 'floor' | 'ceil' | 'round', unit: number) {
  return Math[method](num / unit) * unit;
}

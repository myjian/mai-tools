export function sum(values: IterableIterator<number> | ReadonlyArray<number>) {
  let total = 0;
  for (const v of values) {
    total += v;
  }
  return total;
}

export function roundFloat(num: number, method: 'floor' | 'ceil' | 'round', unit: number) {
  return Math[method](num / unit) * unit;
}

export function formatFloat(n: number, digits: number): string {
  if (n) {
    return n.toFixed(digits);
  }
  return "0";
}

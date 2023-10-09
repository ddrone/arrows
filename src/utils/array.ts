export function replacing<T>(a: Array<T>, index: number, value: T): Array<T> {
  const result = [...a];
  result[index] = value;
  return result;
}

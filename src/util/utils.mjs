/** Sorts descending in-place. Returns the array argument for convenience. */
export function sortDescending(array, sizeOf) {
  return array.sort((left, right) => sizeOf(right) - sizeOf(left));
}

/**
 * Performs a recursive binary search to find the smallest index for which {@param leq} is true,
 * then applies {@param operation} there. The {@param array} is assumed to be sorted according to
 * {@param leq} in relation to objects of the same type as {@param item}. Note that this property
 * may no longer hold after binaryApply returns unless {@param operation} explicitly preserves it.
 * Modifies {@param array}.
 * array                A sorted array
 * item                 The item to be 'inserted' into the array. May not be of the same
 *                      type as the array elements. E.g. each array element may be an
 *                      object or array into which the item can be inserted.
 * leq {function}        (item, array, arrayElement) => whether item is '<=' arrayElement.
 * operation {function}  (item, array, i) => void. i is index in array where item is to
 *                       be applied. Expected to modify array in-place.
 * returns {number}      The index at which operation applied item to array.
 */
export function binaryApply(array, item, leq, operation) {
  return binaryApplyRecursive(array, 0, array.length - 1, item, leq, operation);
}

function binaryApplyRecursive(array, left, right, item, leq, operation) {
  // Base cases
  if (left > right) {
    if (left > right + 1) {
      throw new Error(`Algorithm error: left ${left} > right ${right} + 1`);
    }
    const index = left;
    operation(item, array, index);
    return index;
  }
  if (left === right) {
    const index = leq(item, array, array[left]) ? left : left + 1;
    operation(item, array, index);
    return index;
  }
  // Recursion cases
  const mid = Math.floor((left + right) / 2);
  if (leq(item, array, array[mid])) {
    return binaryApplyRecursive(array, left, mid - 1, item, leq, operation);
  } else {
    return binaryApplyRecursive(array, mid + 1, right, item, leq, operation);
  }
}

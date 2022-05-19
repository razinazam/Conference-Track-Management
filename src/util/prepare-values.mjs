/**
 * Returns an object containing the input as an array less any oversized items, which are moved to
 * a second array.
 */

export function prepareValuesFirstFit(obj, sizeOf, duration) {
  if (
    validateNumber(duration.morningSession, "Session Duration") +
      validateNumber(duration.afternoonSession, "Session Duration") <=
    0
  ) {
    throw new Error("Session Duration must be a positive number");
  }
  const array = toArray(obj);
  const oversized = [];
  const oversizedIndexes = [];
  const iter = array.entries();
  let nextObj = iter.next();
  while (!nextObj.done) {
    const index = nextObj.value[0];
    const element = nextObj.value[1];
    const size = sizeOf(element);
    validateNumber(size, index);
    if (size > Math.max(duration.morningSession, duration.afternoonSession)) {
      oversized.push(element);
      oversizedIndexes.push(index);
    }
    nextObj = iter.next();
  }
  for (const index of oversizedIndexes.reverse()) {
    array.splice(index, 1);
  }
  return { array: array, oversized: oversized };
}

// Since the bestFit implementation adds morning/ afternoon sessions alternately,
// it is assumed each talk can fit in either empty session
// Otherwise the talk will be considered oversized
// First fit implementation does not have this limitation
export function prepareValuesBestFit(obj, sizeOf, duration) {
  if (
    validateNumber(duration.morningSession, "Session Duration") +
      validateNumber(duration.afternoonSession, "Session Duration") <=
    0
  ) {
    throw new Error("Session Duration must be a positive number");
  }
  const array = toArray(obj);
  const oversized = [];
  const oversizedIndexes = [];
  const iter = array.entries();
  let nextObj = iter.next();
  while (!nextObj.done) {
    const index = nextObj.value[0];
    const element = nextObj.value[1];
    const size = sizeOf(element);
    validateNumber(size, index);
    if (size > Math.min(duration.morningSession, duration.afternoonSession)) {
      oversized.push(element);
      oversizedIndexes.push(index);
    }
    nextObj = iter.next();
  }
  for (const index of oversizedIndexes.reverse()) {
    array.splice(index, 1);
  }
  return { array: array, oversized: oversized };
}

export function toArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  } else {
    return Array.from(toIterable(obj));
  }
}

/**
 * Converts its argument to an interable if it is not one already.
 * In particular, if it is a non-iterable object, returns an array of the object's own innumerable
 * property values.
 */
function toIterable(obj) {
  if (obj !== null) {
    if (isIterable(obj)) {
      return obj;
    } else if (typeof obj === "object") {
      return Object.values(obj);
    }
  }
  throw new Error("Must be either iterable or a non-function object");
}

/** Returns whether {@link obj} is iterable. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isIterable(obj) {
  return typeof obj[Symbol.iterator] === "function";
}

function validateNumber(num, context) {
  if (num === null || num === undefined || typeof num !== "number") {
    throw new Error(`Expected a number for ${context}`);
  } else {
    return num;
  }
}

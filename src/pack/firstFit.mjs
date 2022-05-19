import { prepareValuesFirstFit } from "../util/prepare-values.mjs";
import { sortDescending } from "../util/utils.mjs";

// Implementation of the First Fit Bin-Packing Algorithm
// This is the offline version which sorts all talks first according to time duration

export function firstFitScheduler(obj, sizeOf, duration) {
  const { array, oversized } = prepareValuesFirstFit(obj, sizeOf, duration);
  const sessions = [];
  const remaining = [];

  sortDescending(array, sizeOf);

  for (const value of array) {
    const size = sizeOf(value);
    let createNewTrack = true;
    // First iterate over all existing sessions
    for (let i = 0; i < sessions.length; ++i) {
      // If there is space in ith bin, insert talk in bin
      if (size <= remaining[i]) {
        sessions[i].push(value);
        remaining[i] -= size;
        createNewTrack = false;
        break;
      }
    }
    // Else, if could not fit talk into any track, create new track
    // Each track has morning and afternoon sessions so add both simultaneously
    if (createNewTrack) {
      if (size < duration.morninSession) {
        // First create morning Session and insert talk here
        sessions[sessions.length] = [];
        sessions[sessions.length - 1].push(value);
        remaining[sessions.length - 1] = duration.morningSession - size;
        // Then create Afternoon session
        sessions[sessions.length] = [];
        remaining[sessions.length - 1] = duration.afternoonSession;
      } else {
        // Not enough time available in morning session for this talk
        // First create morning Session
        sessions[sessions.length] = [];
        remaining[sessions.length - 1] = duration.morningSession;
        // Then create Afternoon session and insert talk here
        sessions[sessions.length] = [];
        sessions[sessions.length - 1].push(value);
        remaining[sessions.length - 1] = duration.afternoonSession - size;
      }
    }
  }
  return { sessions: sessions, oversized: oversized };
}

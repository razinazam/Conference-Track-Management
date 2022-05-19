import { binaryApply } from "../util/binary-apply.mjs";
import { prepareValuesBestFit } from "../util/prepare-values.mjs";
import { sortDescending } from "../util/utils.mjs";

let morningSession = 0;
let afternoonSession = 0;

class Session {
  talks; // This is an array of all talks (objects)
  utilization; // This is the duration of talks currently added to this session
  duration; // This is total duration of this session (maybe different for morning and afternoon)

  constructor(sduration) {
    this.talks = [];
    this.utilization = 0;
    this.duration = sduration;
  }

  remainingTime() {
    return this.duration - this.utilization;
  }

  add(talk, length) {
    this.talks.push(talk);
    this.utilization += length;
  }
  fits(length) {
    return this.utilization + length <= this.duration;
  }

  static extractTalks(sessions) {
    return sessions.map((session) => session.talks);
  }

  // Used to identify the type of session (morning/ afternoon)
  static extractDurations(sessions) {
    return sessions.map((session) => session.duration);
  }
}
export function bestFitScheduler(obj, sizeOf, duration) {
  const { array, oversized } = prepareValuesBestFit(obj, sizeOf, duration);
  const { sessions, durations } = bestFitSessions(
    sortDescending(array, sizeOf),
    sizeOf,
    duration
  );
  return {
    sessions: sessions,
    oversized: oversized,
    duration: durations,
  };
}
export function bestFitSessions(sorted, sizeOf, duration) {
  morningSession = duration.morningSession;
  afternoonSession = duration.afternoonSession;
  const sessions = [];
  for (const value of sorted) {
    const numSessions = sessions.length;
    // Insert item into (potentially new) bin
    const binIndex = binaryApply(sessions, value, talkLeq, talkInsert(sizeOf));
    // Move updated bin to preserve sort
    binaryApply(sessions, binIndex, sessionMoreFull, sessionSort);
  }
  return {
    sessions: Session.extractTalks(sessions),
    durations: Session.extractDurations(sessions),
  };
}

const talkLeq = (talk, _, session) => session.fits(sizeOf(talk));

const talkInsert = function (sizeOf) {
  return function (talk, sessions, i) {
    if (i >= sessions.length) {
      // Need to add a new session
      // Morning and afternoon sessions are created alternately
      if (i % 2 == 0) {
        // Add morning session
        sessions.push(new Session(morningSession));
      } else {
        // Add afternoon session
        sessions.push(new Session(afternoonSession));
      }
    }
    sessions[i].add(talk, sizeOf(talk));
  };
};
// Sort it according to remaining time
const sessionMoreFull = (currentIndex, sessions, bin) =>
  sessions[currentIndex].remainingTime() <= bin.remainingTime();

// Resort the binary search tree after adding talk to a session
const sessionSort = (currentIndex, sessions, i) => {
  if (i === currentIndex) {
    return;
  }
  if (i > currentIndex) {
    throw new Error(
      `Algorithm error: newIndex ${i} > currentIndex ${currentIndex}`
    );
  }
  const sessionToMove = sessions[currentIndex];
  sessions.copyWithin(i + 1, i, currentIndex);
  sessions[i] = sessionToMove;
};

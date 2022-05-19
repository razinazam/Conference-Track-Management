const { DateTime } = require("luxon");

// This function formats result of scheduling into required output format
// sessions: Result of bin-packing
// duration: Array containing duration of each session
// sessionduration: Object containing durations of morning and afternoon
// startTimes: Start times of morning and afternoon sessions
function formatOp(sessions, duration, sessionduration, startTimes) {
  const morningStartTime = DateTime.fromObject({ hour: startTimes.morning });
  const afternoonStartTime = DateTime.fromObject({
    hour: startTimes.afternoon,
  });
  if (duration) {
    // Duration is only provided for bestfit
    swapOrderSessions(sessions, duration, sessionduration);
  }
  let stime;
  for (let i = 0; i < sessions.length; i++) {
    let track = Math.floor(i / 2) + 1;
    if (i % 2 == 0) {
      console.log(`\n Track ${track} \n`);
      stime = morningStartTime;
    } else stime = afternoonStartTime;
    for (const talk of sessions[i]) {
      console.log(`${stime.toFormat("h:mma")}` + ` ${talk.title}`);
      console.log("Duration:" + talk.duration + " minutes \n");

      stime = stime.plus({ minutes: talk.duration });
    }
  }
}

// In best fit, order of sessions is changed and not morning/afternoon ...
// This function fixes the order for displaying on screen
// durations: array of session durations
function swapOrderSessions(sessions, durations, sessionduration) {
  const msd = sessionduration.morningSession;
  const asd = sessionduration.afternoonSession;
  for (let i = 0; i < durations.length; i++) {
    if (i % 2 == 0) {
      const j = durations.indexOf(msd, i);
      [durations[i], durations[j]] = [durations[j], durations[i]];
      [sessions[i], sessions[j]] = [sessions[j], sessions[i]];
    } else {
      const j = durations.indexOf(asd, i);
      [durations[i], durations[j]] = [durations[j], durations[i]];
      [sessions[i], sessions[j]] = [sessions[j], sessions[i]];
    }
  }
}

module.exports = {
  formatOp,
};

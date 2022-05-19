/*
A simple approach to scheduling conference talks
Two approximation algorithms are implemented to solve this problem:
1. First Fit Decreasing Algorithm
2. Best Fit Decreasing Algorithm

Both of these algorithms create sessions (morning/ afternoon) and fit talks in them using 
the bin-packing approach.
Morning and afternoon sessions may have different durations.

*/
const formatter = require("./src/util/formatter");
require = require("esm")(module);
const bestFitAlgo = require("./src/pack/bestFit.mjs");
const firstFitAlgo = require("./src/pack/firstFit.mjs");
const {sessions} = require("./test/data")
// const { formatOp } = require("./src/util/utils.mjs");

/////////////////////////////
// Inputs to the algorithms
/////////////////////////////

// Since each track has morning and afternoon sessions, require start and stop times as input
// These times are in minutes
const morningSession = 180;
const afternoonSession = 240; // Maximum allowed time for the afternoon session

duration = {
  morningSession: morningSession,
  afternoonSession: afternoonSession,
};

////////////////////////////////////////////////////
// Test input

// First schedule using Best Fit
result = bestFitAlgo.bestFitScheduler(
  sessions.slice(),
  (sizeOf = (item) => item.duration),
  duration
);

// Now schedule using First fit for comparison
result2 = firstFitAlgo.firstFitScheduler(
  sessions.slice(),
  (sizeOf = (item) => item.duration),
  duration
);

console.log("\n\n Sample output of Best Fit Algorithm \n\n");
formatter.formatOp(result.sessions, result.duration, duration, {
  morning: 9,
  afternoon: 13,
});
console.log("\n\n Sample output of First Fit Algorithm \n\n");
formatter.formatOp(result2.sessions, null, duration, {
  morning: 9,
  afternoon: 13,
});

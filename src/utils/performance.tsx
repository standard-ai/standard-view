// performance.tsx

/**
 * Performance Check Timers
 * Aggregates timers that execute multiple times with the same name.
 * Handles multiple concurrent timers with different names.
 * Cannot aggregate multiple concurrent timers with the same name.
 *
 * Usage:
 *    - Place performanceStart("timer name") at the beginning.
 *    - Place performanceEnd("timer name") at the end.
 *    - For multiple timers, names must be unique.
 *    - stopwatchMode allows for printing total performance time
 *    at each occurence of performanceEnd without having to
 *    create new performanceStart's. Default is false.
 *    - Place performanceLog("timer name") after recording with
 *    performanceStart and performanceEnd to print results.
 */

const timers = {};

export function performanceStart(
  name = "no name",
  stopwatchMode = false
): void {
  // Timer Already Exists
  if (timers[name]) {
    const timer = timers[name];

    // Timer Already Running
    if (timer.running) {
      console.warn(
        `${name} is already running! Cannot start another timer with the same name.`
      );
      return;
    }

    // Start Timer
    timer.running = true;
    timer.start = performance.now();
    return;
  }

  // New Timer
  timers[name] = {
    start: 0,
    count: 0,
    total: 0,
    average: 0,
    running: true,
    stopwatchMode
  };

  timers[name].start = performance.now();
}

export function performanceEnd(name = "no name"): void {
  const end = performance.now();

  // Timer Never Started
  if (timers[name] == null) {
    console.warn(
      `Timer ${name} does not exist. Make sure to place performanceStart("timer name") before performanceEnd("timer name")!`
    );
    return;
  }

  const timer = timers[name];
  if (!timer.running) {
    console.warn(
      `Timer ${name} not running. Make sure to place performanceStart("timer name") before performanceEnd("timer name")!`
    );
    return;
  }

  // End Timer
  const time = end - timer.start;
  timer.count++;
  timer.total += time;
  timer.average = timer.total / timer.count;

  // Stopwatch Mode
  if (timer.stopwatchMode) {
    /* eslint-disable-next-line no-console */
    console.log(
      `${name}: total ${timer.total}, average ${timer.average}, runs ${timer.count}`
    );
    timer.start = performance.now();
  } else {
    timer.running = false;
  }
}

export function performanceLog(
  name = "no name",
  print = true
): { average: number; total: number; count: number } {
  // Timer Never Recorded
  if (timers[name] == null) {
    console.warn(
      `Timer ${name} never recorded. Make sure to place performanceStart("timer name") and performanceEnd("timer name") before performanceLog("timer name")!`
    );
    return { average: 0, total: 0, count: 0 };
  }

  const { count, total, average } = timers[name];

  if (print) {
    /* eslint-disable-next-line no-console */
    console.log(
      `\x1b[36m ${name}\t \x1b[33m average: ${average}\t \x1b[31m total: ${total}\t \x1b[92m count: ${count}`
    );
  }
  return { average, total, count };
}

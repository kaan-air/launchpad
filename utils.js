import { getInputs, getOutputs, Input, Output } from 'easymidi';

const inputs = getInputs();
export const input = new Input(inputs[1]);

const outputs = getOutputs();
export const output = new Output(outputs[1]);

// input.on('noteon', ({ note, channel, velocity }) => console.log('noteon', { note, channel, velocity }));
// input.on('cc', ({ channel, controller, value }) => console.log('cc', { channel, controller, value }));

export const buttonStates = {};

// Main 8x8 pad grid
export const BUTTON_MAP_MAIN = [
  [81,82,83,84,85,86,87,88],
  [71,72,73,74,75,76,77,78],
  [61,62,63,64,65,66,67,68],
  [51,52,53,54,55,56,57,58],
  [41,42,43,44,45,46,47,48],
  [31,32,33,34,35,36,37,38],
  [21,22,23,24,25,26,27,28],
  [11,12,13,14,15,16,17,18],
];

// Top 8 "control" pads (up,down,left,right,session,note,custom,capture midi)
export const BUTTON_MAP_TOP = [91,92,93,94,95,96,97,98];

// Right 8 "control" pads (volume,pan,senda,sendb,stop,mute,solo,record)
export const BUTTON_MAP_RIGHT = [89,79,69,59,49,39,29,19];

// Entire board including Top and Right pads
export const BUTTON_MAP_ALL = [
  [91,92,93,94,95,96,97,98,-1],
  [81,82,83,84,85,86,87,88,89],
  [71,72,73,74,75,76,77,78,79],
  [61,62,63,64,65,66,67,68,69],
  [51,52,53,54,55,56,57,58,59],
  [41,42,43,44,45,46,47,48,49],
  [31,32,33,34,35,36,37,38,39],
  [21,22,23,24,25,26,27,28,29],
  [11,12,13,14,15,16,17,18,19],
];

export const COLORS = {
  OFF: 0,
  WHITE: 3,
  RED: 5,
  ORANGE: 9,
  YELLOW: 13,
  GREEN: 21,
  AQUA: 37,
  BLUE: 45,
  INDIGO: 53,
  VIOLET: 57,
};

export const setButtonColor = (note, color) => {
  buttonStates[note] = color;
  output.send('noteon', { note, velocity: color, channel: 0 })
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const turnOffAllLEDs = async () => {
  for (const note of BUTTON_MAP_ALL.flatMap((row) => row)) {
    setButtonColor(note, COLORS.OFF);
    await sleep(2);
  }
};

export const cleanup = async () => {
  console.log('Closing MIDI connections...');

  await turnOffAllLEDs();

  input.close();
  output.close();
  process.exit();
};

export const setupCleaners = () => {
  process.on('SIGINT', cleanup);
  process.on('exit', cleanup);
  process.on('uncaughtException', cleanup);
}
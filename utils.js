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

export const BUTTON_MAP_MAIN_FLAT = BUTTON_MAP_MAIN.flatMap((row) => row);

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

export const BUTTON_MAP_ALL_FLAT = BUTTON_MAP_ALL.flatMap((row) => row);

export const PAD_COLORS = [
  '#000000', // OFF
  '#252525',
  '#8F8F8F',
  '#FFFFFF', // WHITE
  '#FF655C',
  '#FF0000', // RED
  '#6E0A03',
  '#220100',
  '#FFC77C',
  '#FF7F00', // ORANGE
  '#6E2806',
  '#301F02',
  '#FFF84D',
  '#FFFF00', // YELLOW
  '#6C6915',
  '#201F02',
  '#94F751',
  '#53F63C',
  '#1E6814',
  '#193306',
  '#45F751',
  '#00FF00', // GREEN
  '#54DA4E',
  '#001E02',
  '#43F768',
  '#09F63B',
  '#02681D',
  '#51A74F',
  '#40F897',
  '#04F75D',
  '#016822',
  '#002413',
  '#39F8C1',
  '#00F7A7',
  '#006943',
  '#001F13',
  '#3FCFFC',
  '#00B8FC',
  '#005263',
  '#00141F',
  '#499EFB',
  '#0070FA',
  '#00296B',
  '#000720',
  '#4F69FA',
  '#0000FF', // BLUE
  '#0014C0',
  '#000220',
  '#926AF9',
  '#5B3DF9',
  '#171877',
  '#080840',
  '#FF70FA',
  '#4B0082', // INDIGO
  '#6D196B',
  '#210320',
  '#FF6995',
  '#9400D3', // VIOLET
  '#6E0D24',
  '#2C0213',
  '#FF3313',
  '#AD470A',
  '#8E6315',
  '#507417',
];

export const COLORS = {
  // TEST: COLORS[0].pad,
  OFF: 0,
  WHITE: 3,
  RED: 5,
  ORANGE: 9,
  YELLOW: 13,
  GREEN: 21,
  BLUE: 45,
  INDIGO: 53,
  VIOLET: 57,
  NZXT_PURPLE: 81,
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

export const hexBrightness = (hex, brightness) => {
    // Clamp brightness to ensure it's between 0 and 1
    brightness = Math.max(0, Math.min(1, brightness));
    
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate new RGB values based on brightness
    r = Math.round(r * brightness);
    g = Math.round(g * brightness);
    b = Math.round(b * brightness);
    
    // Convert back to hex
    const newHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    return newHex;
}

import { input, setButtonColor, BUTTON_MAP_MAIN, BUTTON_MAP_TOP, BUTTON_MAP_RIGHT, buttonStates, setupCleaners, COLORS } from '../utils.js';

BUTTON_MAP_TOP.forEach((note) => setButtonColor(note, COLORS.WHITE));
BUTTON_MAP_RIGHT.forEach((note) => setButtonColor(note, COLORS.WHITE));
setButtonColor(19, COLORS.OFF);

let copy;
let lightsOn = true;

const toggleAllLights = () => {
  console.log('toggleAllLights');
  if (lightsOn) {
    copy = { ...buttonStates };
    BUTTON_MAP_MAIN.flatMap((row) => row).forEach((note) => setButtonColor(note, COLORS.OFF));
    lightsOn = false;
  } else {
    BUTTON_MAP_MAIN.flatMap((row) => row).forEach((note) => setButtonColor(note, copy[note]));
    lightsOn = true;
    copy = {};
  }
};

const toggleButtonColor = (note) => {
  setButtonColor(note, buttonStates[note] ? COLORS.OFF : COLORS.RED);
}

input.on('noteon', ({ channel, note, velocity }) => {
  if (velocity === 0) return;
  toggleButtonColor(note);
});

input.on('cc', ({ channel, controller, value }) => {
  if (value === 0) return;
  if (controller === 19) {
    toggleAllLights();
    return;
  }

  toggleButtonColor(controller);
});

setupCleaners();

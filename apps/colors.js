
import { input, setButtonColor, BUTTON_MAP_MAIN, setupCleaners, COLORS } from '../utils.js';

const setBoard = (offset = 0) => {
  BUTTON_MAP_MAIN.flatMap((row) => row).forEach((note, index) => setButtonColor(note, index + offset));
}

setBoard();
setButtonColor(91, COLORS.WHITE);
setButtonColor(92, COLORS.OFF);

input.on('cc', ({ channel, controller, value }) => {
  if (controller === 92) { // UP ARROW
    setButtonColor(91, COLORS.OFF);
    setButtonColor(92, COLORS.WHITE);
    return setBoard(64);
  }

  if (controller === 91) { // DOWN ARROW
    setButtonColor(91, COLORS.WHITE);
    setButtonColor(92, COLORS.OFF);
    return setBoard();
  }
});

setupCleaners();

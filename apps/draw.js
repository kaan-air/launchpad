import { setButtonColor, BUTTON_MAP_MAIN, input, sleep, setupCleaners, COLORS } from '../utils.js';

let selectedColor = COLORS.RED;

// Initalise bottom row of pads as color picker
setButtonColor(11, COLORS.RED);
setButtonColor(12, COLORS.ORANGE);
setButtonColor(13, COLORS.YELLOW);
setButtonColor(14, COLORS.GREEN);
setButtonColor(15, COLORS.BLUE);
setButtonColor(16, COLORS.INDIGO);
setButtonColor(17, COLORS.VIOLET);
setButtonColor(18, COLORS.OFF);
setButtonColor(19, selectedColor);

const handleColorPicker = (note) => {
  switch (note) {
    case 11:
      selectedColor = COLORS.RED;
      setButtonColor(19, selectedColor);
      return;
    case 12:
      selectedColor = COLORS.ORANGE;
      setButtonColor(19, selectedColor);
      return;
    case 13:
      selectedColor = COLORS.YELLOW;
      setButtonColor(19, selectedColor);
      return;
    case 14:
      selectedColor = COLORS.GREEN;
      setButtonColor(19, selectedColor);
      return;
    case 15:
      selectedColor = COLORS.BLUE;
      setButtonColor(19, selectedColor);
      return;
    case 16:
      selectedColor = COLORS.INDIGO;
      setButtonColor(19, selectedColor);
      return;
    case 17:
      selectedColor = COLORS.VIOLET;
      setButtonColor(19, selectedColor);
      return;
    case 18:
      selectedColor = COLORS.OFF;
      setButtonColor(19, selectedColor);
      return;
  }
};

const eraseDrawableArea = () => {
  for (let x = 0; x <= 7; x++) {
    for (let y = 0; y <= 6; y++) {
      setButtonColor(BUTTON_MAP_MAIN[y][x], COLORS.OFF);
    } 
  }
};

input.on('noteon', ({ note, velocity, channel } ) => {
  if (velocity === 0) return;

  // Erase button
  if (note === 19) {
    eraseDrawableArea();
    return;
  }

  // Bottom colour picker row
  if ([11, 12, 13, 14, 15, 16, 17, 18].includes(note)) {
    handleColorPicker(note);
    return;
  }

  // Draw color at location
  setButtonColor(note, selectedColor);
});

setupCleaners();
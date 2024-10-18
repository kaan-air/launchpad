import { input, setButtonColor, sleep, setupCleaners, COLORS, BUTTON_MAP_MAIN } from '../utils.js';

const handleTouch = async (note) => {
  const columnIndex = Number(String(note).split('')[1]) - 1;

  for (let i = 0; i < 8; i++) {
    setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], COLORS.BLUE);
    await sleep(100);

    for (let j = 0; j <= i; j++) {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], COLORS.OFF);  
    }
  }
}

input.on('noteon', ({ note, velocity, channel } ) => {
  if (velocity === 0) return;
  handleTouch(note);
});

setupCleaners();
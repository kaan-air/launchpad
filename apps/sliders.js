import { input, BUTTON_MAP_MAIN, setButtonColor, sleep, setupCleaners, COLORS } from '../utils.js';

const columnHeights = [7,7,7,7,7,7,7,7];

const handleColumn = async (note) => {
  const columnIndex = Number(String(note).split('')[1]) - 1
  const newHeight = 8 - Number(String(note).split('')[0]);
  if (columnHeights[columnIndex] === newHeight) return;
  
  const countDown = columnHeights[columnIndex] > newHeight;
  
  for (let i = countDown ? 7 : 0; countDown ? i >= 0 : i <= 7; countDown ? i-- : i++) {
    if (i < newHeight) {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], COLORS.OFF);
    } else if (i > newHeight) {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], COLORS.WHITE);
    } else {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], newHeight === 0 ? COLORS.RED : COLORS.GREEN);
    }
    await sleep(20);
  }

  columnHeights[columnIndex] = newHeight;
}

// Initially animate sliders up to max, then down to height of 4
handleColumn(81);
handleColumn(82);
handleColumn(83);
handleColumn(84);
handleColumn(85);
handleColumn(86);
handleColumn(87);
handleColumn(88);
await sleep(250);
handleColumn(41);
handleColumn(42);
handleColumn(43);
handleColumn(44);
handleColumn(45);
handleColumn(46);
handleColumn(47);
handleColumn(48);

input.on('noteon', ({ note, velocity, channel }) => {
  if (velocity === 0) return;
  if (!lightsOn) return;
  handleColumn(note);
});

setupCleaners();
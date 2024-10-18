import { setButtonColor, BUTTON_MAP_MAIN, sleep, setupCleaners, COLORS } from '../utils.js';

const columnHeights = [7,7,7,7,7,7,7,7];

const handleColumnAuto = async (columnIndex) => {
  const newHeight = 7 - Math.floor(Math.random() * 8);

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
};

const randomNum = (min, max) => Math.floor(Math.random() * (max-min)) + min;

const loopColumn = async (index, minSleep, maxSleep) => {
  handleColumnAuto(index);
  await sleep(randomNum(minSleep, maxSleep));
  await loopColumn(index, minSleep, maxSleep);
};

const columnConfigs = [
  { index: 0, minSleep: 150, maxSleep: 160 },
  { index: 1, minSleep: 150, maxSleep: 160 },
  { index: 2, minSleep: 150, maxSleep: 160 },
  { index: 3, minSleep: 150, maxSleep: 160 },
  { index: 4, minSleep: 150, maxSleep: 160 },
  { index: 5, minSleep: 150, maxSleep: 160 },
  { index: 6, minSleep: 150, maxSleep: 160 },
  { index: 7, minSleep: 150, maxSleep: 160 },
];

columnConfigs.forEach(({ index, minSleep, maxSleep }) => loopColumn(index, minSleep, maxSleep));

setupCleaners();
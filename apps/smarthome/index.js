import { input, BUTTON_MAP_MAIN, setButtonColor, sleep, setupCleaners, COLORS } from '../../utils.js';
import { connectToOpenRGBServer, devices, setDeviceColor } from './openrgbBridge.js';

const columnHeights = [7,7,7,7,7,7,7,7];

await connectToOpenRGBServer();

const PALETTE = [
  '#000000',
  '#0e001b',
  '#210036',
  '#350054',
  '#4a0073',
  '#610094',
  '#7800b6',
  '#9100da',
  '#aa00ff',
];

const handleDeviceColorChange = async (columnIndex) => {
  if (!devices[columnIndex]) return;

  const brightness = ((8 - columnHeights[columnIndex]) / 8) * 100;
  const paletteIndex = brightness / 12.5;

  setDeviceColor(columnIndex, PALETTE[paletteIndex]);
}

const handleColumn = async (note, delay) => {
  const columnIndex = Number(String(note).split('')[1]) - 1
  const currentHeight = columnHeights[columnIndex];
  const newHeight = 8 - Number(String(note).split('')[0]);
  if (currentHeight === 7 && newHeight === 7) {
    setButtonColor(BUTTON_MAP_MAIN[7][columnIndex], COLORS.OFF);
    columnHeights[columnIndex] = 8;
    handleDeviceColorChange(columnIndex);
    return;
  }
  
  if (currentHeight === newHeight) return;
  
  const countDown = currentHeight > newHeight;
  
  for (let i = countDown ? 7 : 0; countDown ? i >= 0 : i <= 7; countDown ? i-- : i++) {
    if (i < newHeight) {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], COLORS.OFF);
    } else if (i > newHeight) {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], COLORS.WHITE);
    } else {
      setButtonColor(BUTTON_MAP_MAIN[i][columnIndex], newHeight === 0 ? COLORS.RED : newHeight === 7 ? COLORS.WHITE : COLORS.GREEN);
    }
    await sleep(delay ?? 20);
  }

  columnHeights[columnIndex] = newHeight;
  handleDeviceColorChange(columnIndex);
}

// Initially animate all sliders up to max, then down to height of 4
// Then either up to max again, or down to 0 depending on whether of not an OpenRGB device exists for given index
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
await sleep(250);
handleColumn(81);
handleColumn(82);
handleColumn(83);
handleColumn(14);
handleColumn(15);
handleColumn(16);
handleColumn(17);
handleColumn(18);

input.on('noteon', async ({ note, velocity, channel }) => {
  if (velocity === 0) return;
  await handleColumn(note);
});

input.on('cc', async ({ channel, controller, value }) => {
  if (value === 0) return;
  if (controller === 91) { // Up arrow
    for (const index in Array.from({ length: 8 })) {
      await handleColumn(BUTTON_MAP_MAIN[0][index], 5);
    }
  }

  if (controller === 92) { // Down arrow
    // await handleColumn(12);
    for (const index in Array.from({ length: 8 })) {
      await handleColumn(BUTTON_MAP_MAIN[7][index], 2);
      await sleep(10);
      await handleColumn(BUTTON_MAP_MAIN[7][index], 5);
    }
  }
});

setupCleaners();
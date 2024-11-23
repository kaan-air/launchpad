import 'dotenv/config';
import { input, BUTTON_MAP_MAIN, setButtonColor, sleep, setupCleaners, COLORS, hexBrightness, buttonStates, PAD_COLORS, BUTTON_MAP_MAIN_FLAT } from '../../utils.js';
import { connectToOpenRGBServer, devices, setDeviceColor } from './openrgbBridge.js';
import hap, { Perms } from "hap-nodejs";

const { HAP_USERNAME, HAP_PINCODE, HAP_PORT } = process.env;

const lightUUID = hap.uuid.generate('hap-nodejs:accessories:rgb-light');
const lightAccessory = new hap.Accessory('RGB Light', lightUUID);
const lightbulbService = lightAccessory.addService(hap.Service.Lightbulb, 'RGB Light');

// const testUUID = hap.uuid.generate('hap-nodejs:accessories:rgb-light');
// const testAccessory = new hap.Accessory('RGB Light', testUUID);
// const testService = testAccessory.addService(hap.Service., 'RGB Light');

lightbulbService.getCharacteristic(hap.Characteristic.On)
.setProps({ perms: [Perms.PAIRED_READ, Perms.NOTIFY] })
.on('get', (callback) => {
  const isOn = columnHeights[3] > 0;
  console.log('callback On: ', isOn);
  return callback(null, isOn);
});
// .on('set', async (value, callback) => {
//   console.log(`Light is now ${value ? 'ON' : 'OFF'}`);
//   // if (value) {
//   //   await handleColumn(BUTTON_MAP_MAIN[7][3]);
//   // } else {
//   //   await handleColumn(BUTTON_MAP_MAIN[7][3]);
//   //   await handleColumn(BUTTON_MAP_MAIN[7][3]);
//   // }
//   // Add your code to turn the light on/off
//   callback(null);
// });

// Handle the Brightness characteristic
lightbulbService.addCharacteristic(hap.Characteristic.Brightness)
.setProps({ perms: [Perms.PAIRED_READ, Perms.NOTIFY] })
.on('get', (callback) => {
  const value = columnHeights[3];
  // const index = 7 - Math.floor((value / 100) * (7));
  const brightness = Math.floor((100/7)*value);
  console.log('callback brightness: ', brightness);
  callback(null, brightness);
});
// .on('set', async (value, callback) => {
//   console.log(`Setting brightness to ${value}%`);    
//   // const index = 7 - Math.floor((value / 100) * (7));
//   // await handleColumn(BUTTON_MAP_MAIN[index][3]);
//   callback(null);
// });

lightbulbService.addCharacteristic(hap.Characteristic.Hue)
.setProps({ perms: [Perms.PAIRED_READ, Perms.NOTIFY] });
// .on('set', (value, callback) => {
//   console.log(`Setting hue to ${value} degrees`);
//   callback(null);
// });

lightbulbService.addCharacteristic(hap.Characteristic.Saturation)
.setProps({ perms: [Perms.PAIRED_READ, Perms.NOTIFY] });
// .on('set', (value, callback) => {
//   console.log(`Setting saturation to ${value}%`);
//   callback(null);
// });

lightAccessory.publish({
  username: HAP_USERNAME,
  pincode: HAP_PINCODE,
  port: Number(HAP_PORT),
  category: hap.Categories.LIGHTBULB,
});
console.log('RGB Light accessory is running...');

const columnHeights = [7,7,7,7,7,7,7,7];

await connectToOpenRGBServer();

let startupAnimationFinished = false;
let SELECTED_COLOR = PAD_COLORS[53];

const handleDeviceColorChange = async (columnIndex) => {
  const brightness = ((8 - columnHeights[columnIndex]) / 8);

  if (columnIndex === 3 && startupAnimationFinished) {
    const newBrightness = brightness * 100;
    if (newBrightness === 0) {
      lightbulbService.getCharacteristic(hap.Characteristic.On).updateValue(false);
    } else {
      lightbulbService.getCharacteristic(hap.Characteristic.On).updateValue(true);
      lightbulbService.getCharacteristic(hap.Characteristic.Brightness).updateValue(newBrightness);
    }
    return;
  }

  if (!devices[columnIndex]) return;

  setDeviceColor(columnIndex, hexBrightness(SELECTED_COLOR, brightness));
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
await sleep(250);
startupAnimationFinished = true;

let colorPickerActive = false;
let copy;
let interval;
const toggleColorPicker = (state) => {
  if (colorPickerActive) {
    clearInterval(interval);
    BUTTON_MAP_MAIN_FLAT.forEach((note) => setButtonColor(note, copy[note]));
    colorPickerActive = false;
    copy = {};
  } else {
    let flash = false;
    copy = { ...buttonStates };
    BUTTON_MAP_MAIN_FLAT.forEach((note, index) => setButtonColor(note, index));
    colorPickerActive = true;
    interval = setInterval(() => {
      const selectedColorIndex = PAD_COLORS.findIndex((hex) => hex === SELECTED_COLOR);
      BUTTON_MAP_MAIN_FLAT.forEach((note, index) =>
        setButtonColor(note, selectedColorIndex === index && !flash ? 0 : index)
      );
      flash = !flash;
    }, 250);
  }
};

input.on('noteon', async ({ note, velocity, channel }) => {
  if (velocity === 0) return;

  if (colorPickerActive) {
    const index = BUTTON_MAP_MAIN_FLAT.findIndex((n) => n === note);
    SELECTED_COLOR = PAD_COLORS[index];

    for (const col in Array.from({ length: 8 })) {
      handleDeviceColorChange(col);
    }

    return;
  }

  await handleColumn(note);
});

input.on('cc', async ({ channel, controller, value }) => {
  if (controller === 19) {
    toggleColorPicker(value === 127 ? true : false);
    return;    
  }

  if (value === 0) return;

  if (controller === 91) { // Up arrow
    for (const index in Array.from({ length: 8 })) {
      await handleColumn(BUTTON_MAP_MAIN[0][index], 5);
    }
  }

  if (controller === 92) { // Down arrow
    for (const index in Array.from({ length: 8 })) {
      await handleColumn(BUTTON_MAP_MAIN[7][index], 2);
      await sleep(10);
      await handleColumn(BUTTON_MAP_MAIN[7][index], 5);
    }
  }
});

setupCleaners();
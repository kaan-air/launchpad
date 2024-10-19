
import { Client } from 'openrgb-sdk';

const DEVICE_NAME_WHITELIST = [
  'NZXT RGB & Fan Controller',
  'NZXT RGB Controller',
  'ASUS GTX 1070 Strix OC',
];

const hexToRGBArray = (hexColor, length) => {
  hexColor = hexColor.replace(/^#/, '');

  return Array(length).fill({
    red: parseInt(hexColor.substring(0, 2), 16),
    green: parseInt(hexColor.substring(2, 4), 16),
    blue: parseInt(hexColor.substring(4, 6), 16),
  });
};

export let client;
export const devices = [];

export const connectToOpenRGBServer = async () => {
  try {
    client = new Client("OpenRGB", 6742, "192.168.1.13");
    await client.connect();
  } catch (error) {
    console.log('Error establishing connection to OpenRGB server: ', error);
  }

  const controllerCount = await client.getControllerCount();
  for (let deviceIndex = 0; deviceIndex < controllerCount; deviceIndex++) {
    const device = await client.getControllerData(deviceIndex);
    if (DEVICE_NAME_WHITELIST.includes(device.name)) {
      devices.push({ id: deviceIndex, ...device });
    }
  }

  return client;
};

export const setDeviceColor = async (deviceIndex, color) => {
  const colors = hexToRGBArray(color, devices[deviceIndex].colors.length);
  await client.updateLeds(devices[deviceIndex].id, colors);
}
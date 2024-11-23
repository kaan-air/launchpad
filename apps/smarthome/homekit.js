import 'dotenv/config';
import { input, BUTTON_MAP_MAIN, setButtonColor, sleep, setupCleaners, COLORS } from '../../utils.js';
import hap from "hap-nodejs";

const accessoryUuid = hap.uuid.generate("hap-nodejs:accessories:launchpad-x");
const accessory = new hap.Accessory("Launchpad X", accessoryUuid);

accessory
  .getService(hap.Service.AccessoryInformation)
  .setCharacteristic(hap.Characteristic.Manufacturer, 'Novation')
  .setCharacteristic(hap.Characteristic.Model, 'Launchpad X')
  .setCharacteristic(hap.Characteristic.SerialNumber, '001');


const padStates = Array(64).fill(false);
const switches = [];

for (let i = 1; i <= 8; i++) {
    const switchName = `Pad ${i}`;
    const switchService = new hap.Service.StatelessProgrammableSwitch(switchName, `pad-${i}`);  // Using Stateless Switch with unique subtype

    // switchService
    //   .getCharacteristic(hap.Characteristic.ProgrammableSwitchEvent)
    //   .setProps({ maxValue: hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS })  // You can add DOUBLE_PRESS or LONG_PRESS if needed
    //   .on('get', (callback) => {
    //     callback(null, hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);
    //   });

    // accessory.addService(switchService);
    // switches.push(switchService);

    switchService
      .getCharacteristic(hap.Characteristic.ProgrammableSwitchEvent)
      .setProps({ maxValue: hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS });

    accessory.addService(switchService);
    switches.push(switchService);
}

accessory.publish({
  username: HAP_USERNAME_2,
  pincode: HAP_PINCODE,
  port: Number(HAP_PORT),
  category: hap.Categories.SWITCH,
});

const handleColumn = async (note, delay) => {
  const padIndex = Number(String(note).split('')[1]) - 1;
  const currentSwitch = switches[padIndex];

  // Toggle the internal state for the corresponding pad
  padStates[padIndex] = !padStates[padIndex];
  
  // Trigger a SINGLE_PRESS event in HomeKit
  currentSwitch
    .getCharacteristic(hap.Characteristic.ProgrammableSwitchEvent)
    .updateValue(hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS);

  console.log(`Pad ${padIndex} toggled ${padStates[padIndex] ? 'ON' : 'OFF'}`);

  // (Optional) Do something else based on the pad state (e.g., lighting the pad, triggering automations)
  setButtonColor(note, COLORS.GREEN);
  await sleep(100);
  setButtonColor(note, COLORS.OFF);
}

input.on('noteon', async ({ note, velocity, channel }) => {
  if (velocity === 0) return;
  try {
    await handleColumn(note);
  } catch (error) {
    console.log('error: ', error);
  }
});

setupCleaners();

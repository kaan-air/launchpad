# launchpad
A collection of fun/interesting node programs specifically designed to run on the Novation Launchpad X. To run any app, simply use the command `node apps/<app_name.js>` (for example `node apps/connect4.js`)

### colors.js
Showcases all 128 possible color values that the Novation Lanuchpad X can represent (0-127). Use the UP/DOWN arrow buttons to cycle between page 1 (colors 0-63) and page 2 (colors 64-127)

### connect4.js
The popular board game, connect4, on a launchpad. Right-side control pads display the color of the current player's move (red or yellow)

### draw.js
A simple color drawing app. Bottom row of pads represent a color picker. Bottom-right control pad displays the currently selected color. Switch between colors and draw!

### eq.js
A music equailizer. Currently displaying random values, but would like to hook this up to a real sound source in the future

### rain.js
The first program that I wrote for the Launchpad X. Simply tap one of the pads in any column then watch a raindrop gently fall to the bottom.

### sliders.js
8 columns of individually adjustable sliders.

### sandbox.js
An app I use to test ideas before turning them into dedicated files/apps within the repo. Potentially unstable

# WIP:

### smarthome/index.js
Using sliders in `sliders.js` to control smart home accessories, and PC RGB lights through OpenRGB
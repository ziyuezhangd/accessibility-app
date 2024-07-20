# Access NYC Mobile

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started
### Start location simulation
In order for the background location tracking task to function, we need to simulate the user device moving. We must do this before we run the application, otherwise and infinite loop will run. Open iOS Simulator, select Features -> Location -> City Run. This will simulate a person running through San Francisco - unfortunately, there is not a pre-set NYC location route.

### Run
1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
     npx expo run:ios
   ```

### Accept permissions

### Changing color theme in simulator
CMD + Shift + A

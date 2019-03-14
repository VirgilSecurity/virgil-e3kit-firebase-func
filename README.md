# Configure your Firebase function to generate Virgil JWT

This repository contains a backend's function that connects your Virgil and Firebase accounts for implementing end-to-end encryption.

## Prerequisites
- [Node](https://nodejs.org/en/download) version **from 6 to 10**
> Node 11 is not supported yet, you can use one of node version managers to switch the version: [n](https://github.com/tj/n) or [nvm](https://github.com/creationix/nvm)

## Configure Your Firebase Project

We assume that you already have a Firebase Project. If you don't, please create one now at your [Firebase Console](https://console.firebase.google.com).

### Configure User Authentication

If you haven't already, set up _Sign-in method_ in your Firebase Project by enabling any of the _Sign-in providers_. For the purposes of this tutorial it doesn't matter which sign-in provider you choose.

To set up your Sign-in method, go to your [Firebase Console](https://console.firebase.google.com) and navigate to **Authentication**, under **Develop**. Go to the **Sign-in method** tab and set up your preferred sing-in method(s).

## Deploy the Firebase function
This Firebase function will connect Firebase's and Virgil's authentication via JWT tokens.

- Clone this repository
  ```bash
  git clone https://github.com/VirgilSecurity/virgil-e3kit-firebase-func.git
  cd virgil-e3kit-firebase-func
  ```

- Install Firebase CLI if you haven't already.
  ```bash
  npm install -g firebase-tools
  ```

- Start up the Firebase CLI
  ```bash
  firebase login
  ```

- Connect this repository to your Firebase project
  ```bash
  firebase use --add
  ```

- Select your firebase project from the list and press ENTER.

- Type an alias for your project and press ENTER again.

- [Sign up for a free Virgil account](https://virgilsecurity.com/getstarted)

- Get your Virgil application config file:

  - On a Dashboard: **CREATE AN APPLICATION** -> choose **ADD END-TO-END ENCRYPTION TO PRODUCT** use case -> press the **CREATE APPLICATION** button -> press the **GENERATE CONFIGURATION FILE** button to generate a config file.
  - Then click the **DOWNLOAD CONFIG FILE** button to download your `config.json` file

- Copy `config.json` to the project's root folder and run:
  ```bash
  cd functions
  npm run configure
  npm install
  ```

* ### **Windows users only**: In **`firebase.json`** rename **`$RESOURCE_DIR`** to **`%RESOURCE_DIR%`**

- Deploy the Firebase function:
  ```bash
  npm run deploy
  ```

- And finally, copy the function's URL to the clipboard: go back to the Firebase console -> Functions tab and take a note of your brand new function's url `https://YOUR_FUNCTION_URL.cloudfunctions.net/api` from the TRIGGER column. **You'll need this when setting up your apps**.

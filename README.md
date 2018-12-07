# Configure your Firebase function to generate Virgil JWT

This repository contains a backend's function that connects your Virgil and Firebase accounts for implementing end-to-end encryption.

## Pre-requisites
- [Node](https://nodejs.org/en/download) version **from 6 to 10**
> Node 11 is not supported yet, you can use one of node version managers to switch the version: [n](https://github.com/tj/n) or [nvm](https://github.com/creationix/nvm)

## Create Firebase project

Open the [Firebase console](https://console.firebase.google.com) and create a new project.

> Or use one that you already have.

## Set up Firebase Authentication for the project
- Select the **Authentication** panel and then click the **Sign In Method** tab.
- Choose your authentication method and turn on the **Enable** switch, then follow instructions and click **Save**.

## Deploy the Firebase function
This Firebase function will connect Firebase's and Virgil's authentication via JWT tokens

- Clone the repo
  ```bash
  git clone https://github.com/VirgilSecurity/e3kit-firebase-func.git
  cd e3kit-firebase-func
  ```
- Start up the Firebase CLI
  ```bash
  firebase login
  ```
> run `npm install -g firebase-tools` if you don't have the cli installed.

 - Connect repo to your Firebase project

  ```bash
  firebase use --add
  ```
- Select your firebase project from the list, ENTER.

- Then you need to type alias for your project and press ENTER again.

- **[Sign up for a free Virgil account](https://virgilsecurity.com/getstarted)**

- Get your Virgil application config file:

  - On a Dashboard: **CREATE AN APPLICATION** -> choose **ADD END-TO-END ENCRYPTION TO PRODUCT** use case -> press the **CREATE APPLICATION** button -> press the **GENERATE CONFIGURATION FILE** button to generate a config file.
  - Then click the **DOWNLOAD CONFIG FILE** button to download your `config.json` file

- Copy `config.json` to the project's root folder and run:
  ```bash
  cd functions
  npm run configure
  npm install
  ```
> **Windows users only**: In `firebase.json` rename `$RESOURCE_DIR` to `%RESOURCE_DIR%`

- Deploy the Firebase function**:
  ```bash
  npm run deploy
  ```

- And finally, copy the function's URL to the clipboard**: go back to the Firebase console -> Functions tab and take a note of your brand new function's url `https://YOUR_FUNCTION_URL.cloudfunctions.net/api` from the TRIGGER column. **You'll need this when setting up your apps**.

# How to connect your Virgil and Firebase accounts for implementing end-to-end encryption

## Current Status: Developer Preview. Supports only email authentication.

[Watch setup tutorial video on YouTube (4 minutes)](https://youtu.be/j0BuBtugYmA)

## Pre-requisites
* Latest [Node](https://nodejs.org/en/download)

## Create Firebase project
* Open the [Firebase console](https://console.firebase.google.com) and create a new project.

> Or use one that you already have.

## Set up Firebase password auth for the project
* Select the **Authentication** panel and then click the **Sign In Method** tab.
* Click **Email/Password** and turn on the **Enable** switch, then click **Save**.
* Let's also set up a Firestore database for the sample apps: select the **Database** panel, click **Create database** under Firestore, choose **Start in test mode** and click **Enable**.
* Once the database is created, click on the **Rules** tab, click **Edit rules** and paste:
  ```
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth.uid != null;
      }
    }
  }
  ```
* Click **PUBLISH**.

## Deploy the Firebase function
This Firebase function will connect Firebase's and Virgil's authentication via JWT tokens

* **Clone the repo**
  ```bash
  git clone https://github.com/VirgilSecurity/e3kit-firebase-func.git
  cd e3kit-firebase-func
  ```
* **Start up the Firebase cli**
  ```bash
  firebase login
  firebase init
  ```
> run `npm install -g firebase-tools` if you don't have the cli installed.

* **User your cursor keys to select**:
  ```bash
  Functions: Configure and deploy Cloud Functions
  ```
  > Use the SPACEBAR to select the option, then hit ENTER to proceed.

* **Select your firebase project** from the list, ENTER.

* **Select the following answers**:
  ```bash
  ? What language would you like to use to write Cloud Functions? TypeScript
  ? Do you want to use TSLint to catch probable bugs and enforce style? Yes
  ? File functions/package.json already exists. Overwrite? No
  ? File functions/tslint.json already exists. Overwrite? No
  ? File functions/tsconfig.json already exists. Overwrite? No
  ? File functions/src/index.ts already exists. Overwrite? No
  ? Do you want to install dependencies with npm now? Yes
  ```

* **[Sign up for a free Virgil account](https://virgilsecurity.com/getstarted)** 

* **Get your Virgil application config file**:

  * **CREATE AN APPLICATION** -> **END-TO-END ENCRYPTION** -> **CREATE APPLICATION** -> **BUILD SECURE, HIPAA-COMPLIANT FIREBASE CHAT**
  * Click the **DOWNLOAD CONFIG FILE** FOR SAMPLES button to download your `config.json` file
  
* **Copy `config.json` to the project's root folder and run**:
  ```bash
  cd functions
  npm run configure
  ```
* (Windows users only) In `firebase.json` rename `$RESOURCE_DIR` to `%RESOURCE_DIR%`
* **And finally, deploy the function**:
  ```bash
  npm run deploy
  ```

**Copy the function's URL to the clipboard**: go back to the Firebase console -> Functions tab and take a note of your brand new function's url `https://YOUR_FUNCTION_URL.cloudfunctions.net/api` from the Event column. **You'll need this when setting up your apps**.

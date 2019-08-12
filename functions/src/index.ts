import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { app } from './app';
import { generateVirgilJwt } from './generate-virgil-jwt';

admin.initializeApp();

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
export const api = functions.https.onRequest(app);

export const getVirgilJwt = functions.https.onCall((_data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called ' +
      'while authenticated.');
  }
  
  return {
    token: generateVirgilJwt(context.auth.uid).toString()
  };
});
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { generateVirgilJwt } from './generate-virgil-jwt';

admin.initializeApp();

export const getVirgilJwt = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called ' +
      'while authenticated.');
  }
  
  // You can use context.auth.token.email, context.auth.token.phone_number or any unique value for identity
  const identity = context.auth.token.uid;

  const token = await generateVirgilJwt(identity);
  return {
    token: token.toString()
  };
});

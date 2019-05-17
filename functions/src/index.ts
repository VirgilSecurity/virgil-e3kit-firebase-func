import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { JwtGenerator } from 'virgil-sdk';
import { VirgilCrypto, VirgilAccessTokenSigner } from 'virgil-crypto';

const app = express();
admin.initializeApp();

interface IRequestWithFirebaseUser extends express.Request {
  user: admin.auth.DecodedIdToken;
}

const validateFirebaseIdToken = (req: IRequestWithFirebaseUser, res: express.Response, next: express.NextFunction) => {
  console.log('Check if request is authorized with Firebase ID token');
  
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>');
    res.status(403).send('Unauthorized');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    req.user = decodedIdToken;
    next();
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(401).send('Unauthorized');
  });
};

const crypto = new VirgilCrypto();

const { appid, apikeyid, apiprivatekey } = functions.config().virgil;
const generator = new JwtGenerator({
  appId: appid,
  apiKeyId: apikeyid,
  apiKey: crypto.importPrivateKey(apiprivatekey),
  accessTokenSigner: new VirgilAccessTokenSigner(crypto)
});

app.use(cors({ origin: true, methods: 'OPTIONS,POST', }));
app.use(validateFirebaseIdToken);
app.get('/virgil-jwt', (req: IRequestWithFirebaseUser, res: express.Response) => {
  // You can use req.user.email, req.user.phone_number or any unique value for identity
  const identity = req.user.uid;
  const virgilJwtToken = generator.generateToken(identity);
  res.json({ token: virgilJwtToken.toString() });
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.api = functions.https.onRequest(app);

exports.getVirgilJwt = functions.https.onCall((_data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called ' +
      'while authenticated.');
  }
  
  return {
    token: generator.generateToken(context.auth.uid).toString()
  };
});
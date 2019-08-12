import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { generateVirgilJwt } from './generate-virgil-jwt';

const app = express();

interface IRequestWithFirebaseUser extends express.Request {
  user: admin.auth.DecodedIdToken;
}

const validateFirebaseIdToken = (req: IRequestWithFirebaseUser, res: express.Response, next: express.NextFunction) => {
  // Check if request is authorized with Firebase ID token
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

app.use(cors({ origin: true, methods: 'OPTIONS,POST', }));
app.use(validateFirebaseIdToken);
app.get('/virgil-jwt', (req: IRequestWithFirebaseUser, res: express.Response) => {
  // You can use req.user.email, req.user.phone_number or any unique value for identity
  const identity = req.user.uid;
  const virgilJwtToken = generateVirgilJwt(identity);
  res.json({ token: virgilJwtToken.toString() });
});

export { app };
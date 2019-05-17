"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const virgil_sdk_1 = require("virgil-sdk");
const virgil_crypto_1 = require("virgil-crypto");
const app = express();
admin.initializeApp();
const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.', 'Make sure you authorize your request by providing the following HTTP header:', 'Authorization: Bearer <Firebase ID Token>');
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
const crypto = new virgil_crypto_1.VirgilCrypto();
const { appid, apikeyid, apiprivatekey } = functions.config().virgil;
const generator = new virgil_sdk_1.JwtGenerator({
    appId: appid,
    apiKeyId: apikeyid,
    apiKey: crypto.importPrivateKey(apiprivatekey),
    accessTokenSigner: new virgil_crypto_1.VirgilAccessTokenSigner(crypto)
});
app.use(cors({ origin: true, methods: 'OPTIONS,POST', }));
app.use(validateFirebaseIdToken);
app.get('/virgil-jwt', (req, res) => {
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
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    return {
        token: generator.generateToken(context.auth.uid).toString()
    };
});
//# sourceMappingURL=index.js.map
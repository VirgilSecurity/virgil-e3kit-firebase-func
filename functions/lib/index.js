"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_functions_1 = __importDefault(require("firebase-functions"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app_1 = require("./app");
const generate_virgil_jwt_1 = require("./generate-virgil-jwt");
firebase_admin_1.default.initializeApp();
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.api = firebase_functions_1.default.https.onRequest(app_1.app);
exports.getVirgilJwt = firebase_functions_1.default.https.onCall((_data, context) => {
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new firebase_functions_1.default.https.HttpsError('unauthenticated', 'The function must be called ' +
            'while authenticated.');
    }
    return {
        token: generate_virgil_jwt_1.generateVirgilJwt(context.auth.uid).toString()
    };
});
//# sourceMappingURL=index.js.map
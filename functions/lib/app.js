"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const generate_virgil_jwt_1 = require("./generate-virgil-jwt");
const app = express_1.default();
exports.app = app;
const validateFirebaseIdToken = (req, res, next) => {
    // Check if request is authorized with Firebase ID token
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.', 'Make sure you authorize your request by providing the following HTTP header:', 'Authorization: Bearer <Firebase ID Token>');
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    firebase_admin_1.default.auth().verifyIdToken(idToken).then((decodedIdToken) => {
        req.user = decodedIdToken;
        next();
    }).catch((error) => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(401).send('Unauthorized');
    });
};
app.use(cors_1.default({ origin: true, methods: 'OPTIONS,POST', }));
app.use(validateFirebaseIdToken);
app.get('/virgil-jwt', (req, res) => {
    // You can use req.user.email, req.user.phone_number or any unique value for identity
    const identity = req.user.uid;
    const virgilJwtToken = generate_virgil_jwt_1.generateVirgilJwt(identity);
    res.json({ token: virgilJwtToken.toString() });
});
//# sourceMappingURL=app.js.map
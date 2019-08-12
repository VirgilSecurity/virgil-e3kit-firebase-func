"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const virgil_sdk_1 = require("virgil-sdk");
const virgil_crypto_1 = require("virgil-crypto");
const functions = __importStar(require("firebase-functions"));
const crypto = new virgil_crypto_1.VirgilCrypto();
const { appid, apikeyid, apiprivatekey } = functions.config().virgil;
const generator = new virgil_sdk_1.JwtGenerator({
    appId: appid,
    apiKeyId: apikeyid,
    apiKey: crypto.importPrivateKey(apiprivatekey),
    accessTokenSigner: new virgil_crypto_1.VirgilAccessTokenSigner(crypto)
});
function generateVirgilJwt(identity) {
    return generator.generateToken(identity);
}
exports.generateVirgilJwt = generateVirgilJwt;
//# sourceMappingURL=generate-virgil-jwt.js.map
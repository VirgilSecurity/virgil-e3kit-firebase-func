import { JwtGenerator } from 'virgil-sdk';
import { VirgilCrypto, VirgilAccessTokenSigner } from 'virgil-crypto';
import * as functions from 'firebase-functions';

const crypto = new VirgilCrypto();

const { appid, apikeyid, apiprivatekey } = functions.config().virgil;

const generator = new JwtGenerator({
  appId: appid,
  apiKeyId: apikeyid,
  apiKey: crypto.importPrivateKey(apiprivatekey),
  accessTokenSigner: new VirgilAccessTokenSigner(crypto)
});

export function generateVirgilJwt(identity: string) {
  return generator.generateToken(identity);
} 

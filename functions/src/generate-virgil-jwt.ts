import { JwtGenerator } from 'virgil-sdk';
import { VirgilCrypto, VirgilAccessTokenSigner } from 'virgil-crypto';
import * as functions from 'firebase-functions';

const crypto = new VirgilCrypto();

const { app_id, app_key_id, app_key } = functions.config().virgil;
console.log('app_id, app_key_id, app_key ', app_id, app_key_id, app_key );
const generator = new JwtGenerator({
  appId: app_id,
  apiKeyId: app_key_id,
  apiKey: crypto.importPrivateKey(app_key),
  accessTokenSigner: new VirgilAccessTokenSigner(crypto)
});

export function generateVirgilJwt(identity: string) {
  return generator.generateToken(identity);
} 

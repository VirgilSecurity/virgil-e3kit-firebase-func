import { JwtGenerator } from 'virgil-sdk';
import { initCrypto, VirgilCrypto, VirgilAccessTokenSigner } from 'virgil-crypto';
import * as functions from 'firebase-functions';

async function getJwtGenerator() {
  await initCrypto();
  
  const crypto = new VirgilCrypto();
  
  const { app_id, app_key_id, app_key } = functions.config().virgil;

  return new JwtGenerator({
    appId: app_id,
    apiKeyId: app_key_id,
    apiKey: crypto.importPrivateKey(app_key),
    accessTokenSigner: new VirgilAccessTokenSigner(crypto),
  });
}

export async function generateVirgilJwt(identity: string) {
  const generator = await getJwtGenerator();
  return generator.generateToken(identity);
}

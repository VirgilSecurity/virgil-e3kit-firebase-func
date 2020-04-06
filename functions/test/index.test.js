const assert = require('assert');
const { initCrypto, VirgilCrypto, VirgilCardCrypto } = require('virgil-crypto');
const { VirgilCardVerifier, CardManager, CallbackJwtProvider } = require('virgil-sdk');
const config = require('./test.config');
const myFunctions = require('../lib/index.js');

const test = require('firebase-functions-test')({
    databaseURL: config.databaseURL,
    storageBucket: config.storageBucket,
    projectId: config.projectId,
}, 'virgil-demo-10380-8d7e72b52304.json');

test.mockConfig({virgil: config.virgil});

describe('Cloud Functions', async () => {
    
    it('Test firebase function for authorized user', async () => {
        const req = { auth: {token: { uid: 'alice@example.com'}} };
        
        const getVirgilJwtWrapped = test.wrap(myFunctions.getVirgilJwt);
        const res = await getVirgilJwtWrapped([], req);
        assert.equal(res.hasOwnProperty('token'), true);

        await initCrypto();
        const cardCrypto = new VirgilCardCrypto(new VirgilCrypto());
        const cardVerifier = new VirgilCardVerifier(cardCrypto);    
        const cardManager = new CardManager({
            cardCrypto: cardCrypto,
            cardVerifier: cardVerifier,
            accessTokenProvider: new CallbackJwtProvider(() => res.token)
        });
        const cards = await cardManager.searchCards('alice@example.com');
        assert.ok(cards);
    });

    it('Test firebase function for unauthorized user', async () => {
        const req = {};

        const getVirgilJwtWrapped = test.wrap(myFunctions.getVirgilJwt);
        await assert.rejects(
            async () => await getVirgilJwtWrapped([], req),
            {
                name: 'Error',
                message: 'The function must be called while authenticated.'
            }
        );
    });
});

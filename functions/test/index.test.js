var assert = require('assert');
var { initCrypto, VirgilCrypto, VirgilCardCrypto } = require('virgil-crypto');
var { VirgilCardVerifier, CardManager, CallbackJwtProvider } = require('virgil-sdk');
var config = require('./test.config');
var myFunctions = require('../lib/index.js');

const test = require('firebase-functions-test')({
    databaseURL: config.databaseURL,
    storageBucket: config.storageBucket,
    projectId: config.projectId,
}, 'virgil-demo-10380-8d7e72b52304.json');

test.mockConfig({virgil: config.virgil});

describe('Cloud Functions', () => {
    let token;
    it('Get Virgil JWT', (done) => {
        const req = { auth: {token: { uid: 'alice@example.com'}} };

        const wrapped = test.wrap(myFunctions.getVirgilJwt);
        wrapped([], req).then((res) => {
            assert.equal(res.hasOwnProperty('token'), true);
            token = res.token;
            done();
        });
    });

    it('Init Card manager', async () => {
        await initCrypto();
        const cardCrypto = new VirgilCardCrypto(new VirgilCrypto());
        const cardVerifier = new VirgilCardVerifier(cardCrypto);

        const cardManager = new CardManager({
            cardCrypto: cardCrypto,
            cardVerifier: cardVerifier,
            accessTokenProvider: new CallbackJwtProvider(() => token)
        });
        
        await cardManager.searchCards('alice@example.com');
        assert.ok(true);
    });
});

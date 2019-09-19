import { VirgilCrypto } from 'virgil-crypto';
import { Jwt } from 'virgil-sdk';
import request from 'supertest';
import { app } from '../app';

const mockVerifyIdToken = jest.fn();

jest.mock('firebase-admin', () => {
  return {
    auth: () => ({ verifyIdToken: mockVerifyIdToken })
  };
});

jest.mock('firebase-functions', () => {
  return {
    config: () => {
      const virgilCrypto = new VirgilCrypto();
      const privateKey = virgilCrypto.exportPrivateKey(virgilCrypto.generateKeys().privateKey);
      return {
        virgil: { 
          app_id: 'mock_virgil_app_id', 
          app_key_id: 'mock_virgil_api_key_id', 
          app_key: privateKey.toString('base64')
        }
      };
    }
  }
});

describe('/get-virgil-jwt', () => {
  beforeEach(() => {
    mockVerifyIdToken.mockReset();
  });

  it('returns 403 response when Bearer token is not passed', () => {
    return request(app)
    .get('/virgil-jwt')
    .set('Accept', 'application/json')
    .expect('Content-Type', /text/)
    .expect(403)
    .then(response => {
      expect(response.error.text).toBe('Unauthorized');
    });
  });

  it('returns 401 response when Bearer token fails validation', () => {
    mockVerifyIdToken.mockRejectedValue('Invalid ID token');

    const invalidIdToken = 'invalid_id_token';

    return request(app)
    .get('/virgil-jwt')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${invalidIdToken}`)
    .expect('Content-Type', /text/)
    .expect(401)
    .then(response => {
      expect(response.error.text).toBe('Unauthorized');
      expect(mockVerifyIdToken).toBeCalledWith(invalidIdToken);
    });
  });

  it('returns Virgil JWT token', () => {
    const fakeUserId = 'fake_user_id';
    mockVerifyIdToken.mockResolvedValue({ uid: fakeUserId });

    return request(app)
    .get('/virgil-jwt')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer fake_id_token')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body.token).toBeDefined();
      const parsedToken = Jwt.fromString(response.body.token);
      expect(parsedToken.identity()).toBe(fakeUserId);
    });
  });
}); 
import * as hash from '../src/utilities/hash';

describe('testing encrypt and decrypt methods', () => {

  jest.spyOn(hash, 'encryptToken');
  jest.spyOn(hash, 'decryptToken');

  describe('test all encryption', () => {
    beforeEach(() => {
      expect(process.env.SECRET_KEY).toBeTruthy();
      expect(process.env.ALGORITHM).toBeTruthy();
      jest.clearAllMocks();
    });

    it('should encrypt token successfully', () => {
      expect(hash.encryptToken('123'))
    });

    it('should throw an error when decrypting invalid string', () => {
      try {
        expect(hash.decryptToken('123'));
      } catch (err) {
        expect(hash.decryptToken).toHaveBeenCalledWith('123');
        expect(err).toBeTruthy();
      }
    });

    it('should encrypt & decrypt token successfully', () => {
      try {
        const encrypted = hash.encryptToken('123');
        const decrypted = hash.decryptToken(encrypted);
        expect(decrypted).toEqual('123');
      } catch (err) {
        expect(err).not.toBeTruthy();
      }
    });
  });
});
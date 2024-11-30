import { monoalphabeticEncrypt, monoalphabeticDecrypt } from '../monoalphabetic';
import { polyalphabeticEncrypt, polyalphabeticDecrypt } from '../polyalphabetic';
import { vigenereEncrypt, vigenereDecrypt } from '../vigenere';
import { transpositionalEncrypt, transpositionalDecrypt } from '../transpositional';
import { vernamEncrypt, vernamDecrypt } from '../vernam';
import { rsaEncrypt, rsaDecrypt, generateRSAKeys } from '../rsa';

const testCases = [
  { input: 'Hello, World!' },
  { input: JSON.stringify({ test: 'data', number: 123 }) },
  { input: 'Special chars: !@#$%^&*()' },
  { input: ' Unicode test' },
  { input: 'A'.repeat(1000) }, // Test longer inputs
];

// Test suite for encryption and decryption functions
describe('Encryption/Decryption Tests', () => {
  describe('Monoalphabetic', () => {
    test.each(testCases)('should correctly encrypt and decrypt: $input', ({ input }) => {
      const shift = 3;
      const encrypted = monoalphabeticEncrypt(input, shift);
      const decrypted = monoalphabeticDecrypt(encrypted, shift);
      expect(decrypted).toBe(input);
    });
  });

  // Test suite for polyalphabetic encryption and decryption
  describe('Polyalphabetic', () => {
    test.each(testCases)('should correctly encrypt and decrypt: $input', ({ input }) => {
      const key = 'TEST';
      const encrypted = polyalphabeticEncrypt(input, key);
      const decrypted = polyalphabeticDecrypt(encrypted, key);
      expect(decrypted).toBe(input);
    });
  });

  // Test suite for Vigenère encryption and decryption
  describe('Vigenere', () => {
    test.each(testCases)('should correctly encrypt and decrypt: $input', ({ input }) => {
      const key = 'SECRETKEY';
      const encrypted = vigenereEncrypt(input, key);
      const decrypted = vigenereDecrypt(encrypted, key);
      expect(decrypted).toBe(input);
    });
  });

  // Test suite for transpositional encryption and decryption
  describe('Transpositional', () => {
    test.each(testCases)('should correctly encrypt and decrypt: $input', ({ input }) => {
      const key = 'CIPHER';
      const encrypted = transpositionalEncrypt(input, key);
      const decrypted = transpositionalDecrypt(encrypted, key);
      expect(decrypted.replace(/\0/g, '')).toBe(input);
    });
  });

  // Test suite for Vernam encryption and decryption
  describe('Vernam', () => {
    test.each(testCases)('should correctly encrypt and decrypt: $input', ({ input }) => {
      const { encrypted, key } = vernamEncrypt(input);
      const decrypted = vernamDecrypt(encrypted, key);
      expect(decrypted).toBe(input);
    });
  });

  // Test suite for RSA encryption and decryption
  describe('RSA', () => {
    test.each(testCases)('should correctly encrypt and decrypt: $input', ({ input }) => {
      const keys = generateRSAKeys();
      const publicKey = JSON.parse(keys.publicKey);
      const privateKey = JSON.parse(keys.privateKey);

      const encrypted = rsaEncrypt(input, publicKey);
      const decrypted = rsaDecrypt(encrypted, privateKey);
      expect(decrypted).toBe(input);
    });
  });
}); 
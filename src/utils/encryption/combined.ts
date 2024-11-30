// Combined Encryption Implementation
// Applies multiple encryption algorithms in sequence for enhanced security
// Order: Monoalphabetic -> Polyalphabetic -> Vigenere -> Transpositional -> Vernam -> RSA

import { monoalphabeticEncrypt, monoalphabeticDecrypt } from './monoalphabetic';
import { polyalphabeticEncrypt, polyalphabeticDecrypt } from './polyalphabetic';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere';
import { transpositionalEncrypt, transpositionalDecrypt } from './transpositional';
import { vernamEncrypt, vernamDecrypt } from './vernam';
import { rsaEncrypt, rsaDecrypt } from './rsa';

// Settings interface for all encryption parameters
interface CombinedSettings {
  shift: number;           // For monoalphabetic
  polyKey: string;         // For polyalphabetic
  vigenereKey: string;     // For vigenere
  transpositionKey: string;// For transpositional
  publicKey?: string;      // For RSA encryption
  privateKey?: string;     // For RSA decryption
}

export function combinedEncrypt(text: string, settings: CombinedSettings) {
  // Normalize JSON input if provided
  let result;
  try {
    const parsed = JSON.parse(text);
    result = JSON.stringify(parsed);
  } catch {
    result = text;
  }
  
  // Layer 1: Basic substitution cipher
  result = monoalphabeticEncrypt(result, settings.shift);
  
  // Layer 2: Multiple substitution patterns
  result = polyalphabeticEncrypt(result, settings.polyKey);
  
  // Layer 3: Vigenère cipher
  result = vigenereEncrypt(result, settings.vigenereKey);
  
  // Layer 4: Rearrange characters
  result = transpositionalEncrypt(result, settings.transpositionKey);
  
  // Layer 5: One-time pad (Vernam)
  const vernam = vernamEncrypt(result);
  result = vernam.encrypted;

  // Layer 6: Asymmetric encryption (RSA)
  if (!settings.publicKey) {
    throw new Error('Public key required for RSA encryption');
  }
  const parsedPublicKey = JSON.parse(settings.publicKey);
  result = rsaEncrypt(result, parsedPublicKey);
  
  // Convert final result to base64 for safe transmission
  result = Buffer.from(result).toString('base64');

  return {
    encrypted: result,
    vernamKey: vernam.key  // Return Vernam key for decryption
  };
}

export function combinedDecrypt(text: string, settings: CombinedSettings, vernamKey: string) {
  // Convert from base64 before decryption
  let result = Buffer.from(text, 'base64').toString();
  
  // RSA decryption
  if (!settings.privateKey) {
    throw new Error('Private key required for RSA decryption');
  }
  const parsedPrivateKey = JSON.parse(settings.privateKey);
  result = rsaDecrypt(result, parsedPrivateKey);
  
  // Vernam decryption
  result = vernamDecrypt(result, vernamKey);
  
  // Apply decryptions in reverse sequence
  result = transpositionalDecrypt(result, settings.transpositionKey);
  result = vigenereDecrypt(result, settings.vigenereKey);
  result = polyalphabeticDecrypt(result, settings.polyKey);
  result = monoalphabeticDecrypt(result, settings.shift);
  
  try {
    // Parse the decrypted result and return it as a formatted JSON string
    const parsed = JSON.parse(result);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return result;
  }
}

export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === BigInt(1)) return BigInt(0);
  let result = BigInt(1);
  base = base % modulus;
  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> BigInt(1); // Equivalent to exponent = exponent / 2
    base = (base * base) % modulus;
  }
  return result;
}
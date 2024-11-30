import { useState, useEffect } from 'react';
import {
  validateMonoalphabetic,
  validatePolyalphabetic,
  validateVigenere,
  validateTranspositional,
  validateRSAPublicKey,
  validateRSAPrivateKey,
} from '@/utils/validation/algorithmValidation';

export function useAlgorithmValidation(
  algorithm: string,                // Type of encryption algorithm    
  shift: number,                    // Shift value for monoalphabetic cipher
  key: string,                      // Key for polyalphabetic, Vigenère, and transpositional ciphers
  publicKey: string,                // Public key for RSA encryption
  privateKey: string,               // Private key for RSA decryption
  operation: 'encrypt' | 'decrypt'  // Operation to perform (encrypt or decrypt)
) {
  // State to hold validation error message
  const [error, setError] = useState<string | null>(null);

  // Effect to validate parameters based on the selected algorithm  
  useEffect(() => {
    // Initialize validation error as null
    let validationError = null;

    switch (algorithm) {
      case 'monoalphabetic':                                        // Validate monoalphabetic parameters
        validationError = validateMonoalphabetic(shift);
        break;
      case 'polyalphabetic':                                        // Validate polyalphabetic parameters
        validationError = validatePolyalphabetic(key);
        break;
      case 'vigenere':                                              // Validate Vigenère parameters
        validationError = validateVigenere(key);
        break;
      case 'transpositional':                                       // Validate transpositional parameters
        validationError = validateTranspositional(key);
        break;
      case 'rsa':                                                   // Validate RSA parameters
        if (operation === 'encrypt') {
          validationError = validateRSAPublicKey(publicKey);
        } else {
          validationError = validateRSAPrivateKey(privateKey);
        }
        break;
    }

    // Update state with validation error message
    setError(validationError?.message || null);
  }, [algorithm, shift, key, publicKey, privateKey, operation]);

  // Return the validation error message
  return error;
} 
'use client';

import { useState, useEffect } from 'react';
import { useAlgorithmValidation } from '@/hooks/useAlgorithmValidation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { generateRSAKeys } from '@/utils/encryption/rsa';
import { useCrypto } from '@/contexts/CryptoContext';
import clsx from 'clsx';

// Type definition for supported encryption algorithms
type AlgorithmType = 'monoalphabetic' | 'polyalphabetic' | 'vernam' | 'vigenere' | 'transpositional' | 'rsa';

// Props interface defining all required properties for the AlgorithmSettings component
interface AlgorithmSettingsProps {
  algorithm: AlgorithmType;                           // Current selected algorithm
  operation: 'encrypt' | 'decrypt';                   // Whether we're encrypting or decrypting
  onValidationChange: (isValid: boolean) => void;     // Callback for parent component validation
  shift: number;                                      // For monoalphabetic cipher
  setShift: (shift: number) => void;
  encryptionKey: string;                              // Used for polyalphabetic, vigenere, and transpositional
  setEncryptionKey: (key: string) => void;
  publicKey: string;                                  // RSA specific keys
  setPublicKey: (key: string) => void;
  privateKey: string;
  setPrivateKey: (key: string) => void;
}

export function AlgorithmSettings({ algorithm, operation, onValidationChange, shift, setShift, encryptionKey, setEncryptionKey, publicKey, setPublicKey, privateKey, setPrivateKey }: AlgorithmSettingsProps) {
  // State for tracking RSA key generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useCrypto();

  // Custom hook to validate algorithm settings based on current algorithm and operation
  const validationError = useAlgorithmValidation(
    algorithm,
    shift,
    encryptionKey,
    publicKey,
    privateKey,
    operation
  );

  // Notify parent component of validation status changes
  useEffect(() => {
    onValidationChange(!validationError);
  }, [validationError, onValidationChange]);

  // Render validation error messages with icon
  const renderError = () => {
    if (!validationError) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
        <AlertCircle className="h-4 w-4" />
        <p>{validationError}</p>
      </div>
    );
  };

  // Render algorithm-specific settings based on selected algorithm
  const renderSettings = () => {
    switch (algorithm) {
      case 'monoalphabetic':
        // Render shift input for Caesar cipher
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Shift Value</label>
            <input
              type="number"
              min="1"
              max={25}
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                       focus:ring-offset-background"
            />
          </div>
        );

      case 'polyalphabetic':
      case 'vigenere':
        // Render key input for polyalphabetic and vigenere ciphers
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Encryption Key</label>
            <input
              type="text"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              placeholder="Enter your key"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                       focus:ring-offset-background"
            />
          </div>
        );

      case 'vernam':
        // Informational message for Vernam cipher (one-time pad)
        return (
          <div className="space-y-2">
            <p className="text-sm text-foreground/60">
              A random key will be generated with the same length as your input.
            </p>
          </div>
        );

      case 'transpositional':
        // Render matrix key input for transpositional cipher
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Matrix Key</label>
            <input
              type="text"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              placeholder="Enter matrix key (e.g., 3214)"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                       focus:ring-offset-background"
            />
          </div>
        );

      case 'rsa':
        // Render RSA key generation and input fields
        return (
          <div className="space-y-4">
            {/* Generate new RSA key pair button */}
            <button
              onClick={async () => {
                try {
                  setIsGenerating(true);
                  const keys = generateRSAKeys();
                  setPublicKey(keys.publicKey);
                  setPrivateKey(keys.privateKey);
                  showToast('RSA keys generated successfully', 'success');
                } catch (error) {
                  console.error('Failed to generate RSA keys:', error);
                  showToast('Failed to generate RSA keys', 'error');
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className={clsx(
                "w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors",
                "flex items-center justify-center gap-2",
                isGenerating && "opacity-50 cursor-not-allowed"
              )}
            >
              {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isGenerating ? 'Generating Keys...' : 'Generate New Key Pair'}
            </button>

            {/* Public key input field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Public Key</label>
              <textarea
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Enter public key or generate a new key pair"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                         focus:ring-offset-background"
              />
            </div>

            {/* Private key input field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Private Key</label>
              <textarea
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter private key or generate a new key pair"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                         focus:ring-offset-background"
              />
            </div>
          </div>
        );
    }
  };

  // Main component render
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground/60">Algorithm Settings</h3>
      {renderSettings()}
      {renderError()}
    </div>
  );
} 
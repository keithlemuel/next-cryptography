'use client';

import { useState } from 'react';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { CombinedSettings } from './CombinedSettings';
import { useCrypto } from '@/contexts/CryptoContext';

// Main component for handling file encryption/decryption operations
export function AlgorithmSelector() {
  // Get crypto context values and functions
  const { file, setFile, isProcessing, setIsProcessing, showToast } = useCrypto();

  // Local state management
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [isValid, setIsValid] = useState(true);
  const [lastVernamKey, setLastVernamKey] = useState<string | null>(null);
  
  // Combined settings state for all encryption algorithms
  const [settings, setSettings] = useState({
    shift: 3,               // Default shift for monoalphabetic cipher
    polyKey: '',            // Polyalphabetic cipher key
    vigenereKey: '',        // Vigenere cipher key
    transpositionKey: '',   // Transposition cipher key
    publicKey: '',          // RSA public key
    privateKey: '',         // RSA private key
    vernamKey: ''           // Vernam cipher key (one-time pad)
  });

  // Callback for handling validation state changes from child components
  const handleValidationChange = (isValid: boolean) => {
    setIsValid(isValid);
  };

  // Main function to handle file processing (encryption/decryption)
  const handleProcess = async () => {
    // Validate file existence
    if (!file) {
      showToast('Please upload a file first', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Prepare form data for API request
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operation', operation);
      formData.append('settings', JSON.stringify(settings));

      // Send request to processing API
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      // Handle API errors
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Processing failed');
      }

      // Get processed file and additional data
      const blob = await response.blob();
      const additionalData = response.headers.get('X-Additional-Data');
      
      // Handle Vernam key for encryption operations
      if (additionalData && operation === 'encrypt') {
        const { vernamKey } = JSON.parse(additionalData);
        setLastVernamKey(vernamKey);
        showToast('File encrypted successfully. Save the Vernam key for decryption.', 'success');
      }

      // Trigger file download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${operation === 'encrypt' ? 'encrypted' : 'decrypted'}_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('File processed successfully', 'success');
    } catch (error) {
      console.error('Processing failed:', error);
      showToast(error instanceof Error ? error.message : 'Processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Combined Encryption Settings</h2>

      <div className="space-y-4">
        {/* Encrypt/Decrypt Toggle Button Group */}
        <div className="bg-card/50 p-0.5 rounded-full">
          <div className="grid grid-cols-2 gap-1">
            {['encrypt', 'decrypt'].map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op as 'encrypt' | 'decrypt')}
                className={clsx(
                  'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
                  'focus:outline-none',
                  operation === op ? 'bg-primary text-white' : 'hover:bg-primary/5'
                )}
              >
                {op === 'encrypt' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Combined Settings Component */}
        <CombinedSettings 
          operation={operation}
          settings={settings}
          setSettings={setSettings}
          onValidationChange={handleValidationChange}
          lastVernamKey={lastVernamKey}
        />

        {/* Process Button */}
        <button 
          onClick={handleProcess}
          disabled={isProcessing || !isValid}
          className={clsx(
            "w-full px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm",
            (isProcessing || !isValid)
              ? "bg-primary/50 cursor-not-allowed" 
              : "bg-primary hover:bg-primary-hover"
          )}
        >
          {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
          {operation === 'encrypt' ? 'Encrypt File' : 'Decrypt File'}
        </button>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { generateRSAKeys } from '@/utils/encryption/rsa';
import { useCrypto } from '@/contexts/CryptoContext';
import clsx from 'clsx';

// Interface defining the props for the CombinedSettings component
// Includes all encryption/decryption settings and callback functions
interface CombinedSettingsProps {
  operation: 'encrypt' | 'decrypt';
  settings: {
    shift: number;
    polyKey: string;
    vigenereKey: string;
    transpositionKey: string;
    publicKey: string;
    privateKey: string;
    vernamKey: string;
  };
  setSettings: (settings: any) => void;
  onValidationChange: (isValid: boolean) => void;
  lastVernamKey: string | null;
}

export function CombinedSettings({ 
  operation, 
  settings, 
  setSettings, 
  onValidationChange, 
  lastVernamKey 
}: CombinedSettingsProps) {
  // State for managing RSA key generation loading state and error messages
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useCrypto();
  const [error, setError] = useState<string | null>(null);

  // Helper function to update individual settings while preserving others
  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  // Comprehensive validation function for all encryption/decryption settings
  const validateSettings = () => {
    // Validates monoalphabetic shift (must be 1-255)
    if (typeof settings.shift !== 'number' || isNaN(settings.shift) || settings.shift < 1 || settings.shift > 255) {
      return 'Shift must be between 1 and 255';
    }

    // Polyalphabetic
    if (!settings.polyKey && operation === 'encrypt') {
      return 'Polyalphabetic key is required for encryption';
    }
    if (settings.polyKey && settings.polyKey.length < 2) {
      return 'Polyalphabetic key must be at least 2 characters long';
    }

    // Vigenere
    if (!settings.vigenereKey && operation === 'encrypt') {
      return 'Vigenere key is required for encryption';
    }
    if (settings.vigenereKey && settings.vigenereKey.length < 2) {
      return 'Vigenere key must be at least 2 characters long';
    }

    // Transpositional
    if (!settings.transpositionKey && operation === 'encrypt') {
      return 'Transpositional key is required for encryption';
    }
    if (settings.transpositionKey && !/^[A-Za-z0-9]+$/.test(settings.transpositionKey)) {
      return 'Transpositional key must contain only letters and numbers';
    }
    if (settings.transpositionKey && settings.transpositionKey.length < 2) {
      return 'Transpositional key must be at least 2 characters long';
    }

    // RSA
    if (operation === 'encrypt') {
      if (!settings.publicKey) {
        return 'RSA public key is required for encryption';
      }
      try {
        const parsed = JSON.parse(settings.publicKey);
        if (!parsed.e || !parsed.n || 
            (typeof parsed.e !== 'number' && typeof parsed.e !== 'string') || 
            (typeof parsed.n !== 'number' && typeof parsed.n !== 'string') ||
            isNaN(Number(parsed.e)) || isNaN(Number(parsed.n))) {
          return 'Invalid RSA public key format';
        }
      } catch {
        return 'Invalid RSA public key format';
      }
    }

    if (operation === 'decrypt') {
      if (!settings.privateKey) {
        return 'RSA private key is required for decryption';
      }
      try {
        const parsed = JSON.parse(settings.privateKey);
        if (!parsed.d || !parsed.n || 
            (typeof parsed.d !== 'number' && typeof parsed.d !== 'string') || 
            (typeof parsed.n !== 'number' && typeof parsed.n !== 'string') ||
            isNaN(Number(parsed.d)) || isNaN(Number(parsed.n))) {
          return 'Invalid RSA private key format';
        }
      } catch {
        return 'Invalid RSA private key format';
      }

      // Vernam key validation for decryption
      if (!settings.vernamKey) {
        return 'Vernam key is required for decryption';
      }
      return null;
    }

    return null;
  };

  // Effect hook to run validation whenever settings or operation changes
  useEffect(() => {
    const validationError = validateSettings();
    setError(validationError);
    onValidationChange(!validationError);
  }, [settings, operation, onValidationChange]);

  return (
    <div className="space-y-6">
      {/* Settings fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Monoalphabetic Shift</label>
          <input
            type="number"
            min={1}
            max={255}
            value={settings.shift}
            onChange={(e) => updateSetting('shift', Number(e.target.value))}
            placeholder="Enter a number between 1 and 255"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Polyalphabetic Key</label>
          <input
            type="text"
            value={settings.polyKey}
            onChange={(e) => updateSetting('polyKey', e.target.value)}
            placeholder="Enter at least 2 letters (e.g., HELLO)"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Vigenere Key</label>
          <input
            type="text"
            value={settings.vigenereKey}
            onChange={(e) => updateSetting('vigenereKey', e.target.value)}
            placeholder="Enter letters only (e.g., CIPHER)"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Transpositional Key</label>
          <input
            type="text"
            value={settings.transpositionKey}
            onChange={(e) => updateSetting('transpositionKey', e.target.value)}
            placeholder="Enter at least 2 characters (e.g., ABC123)"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg"
          />
        </div>

        {operation === 'decrypt' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Vernam Key</label>
            <input
              type="text"
              value={settings.vernamKey}
              onChange={(e) => updateSetting('vernamKey', e.target.value)}
              placeholder="Enter the Vernam key from encryption"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={async () => {
              try {
                setIsGenerating(true);
                const keys = generateRSAKeys();
                setSettings({
                  ...settings,
                  publicKey: keys.publicKey,
                  privateKey: keys.privateKey
                });
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
            {isGenerating ? 'Generating Keys...' : 'Generate RSA Keys'}
          </button>

          <div className="space-y-2">
            <label className="text-sm font-medium">RSA Public Key</label>
            <textarea
              value={settings.publicKey}
              onChange={(e) => updateSetting('publicKey', e.target.value)}
              placeholder="Public key will be generated automatically"
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">RSA Private Key</label>
            <textarea
              value={settings.privateKey}
              onChange={(e) => updateSetting('privateKey', e.target.value)}
              placeholder="Private key will be generated automatically"
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {operation === 'encrypt' && lastVernamKey && (
        <div className="space-y-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-yellow-800">Generated Vernam Key</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(lastVernamKey);
                showToast('Vernam key copied to clipboard', 'success');
              }}
              className="text-xs text-yellow-600 hover:text-yellow-800"
            >
              Copy to clipboard
            </button>
          </div>
          <p className="text-sm font-mono break-all text-yellow-900">{lastVernamKey}</p>
          <p className="text-xs text-yellow-700">Save this key! You'll need it for decryption.</p>
        </div>
      )}
    </div>
  );
} 
'use client';

import { createContext, useContext, useState } from 'react';
import { Toast } from '@/components/ui/Toast';

// Type definition for the context value
interface CryptoContextType {
  file: File | null;              // Currently selected file for encryption/decryption
  setFile: (file: File | null) => void;
  isProcessing: boolean;          // Processing state flag
  setIsProcessing: (isProcessing: boolean) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

// Create context with undefined default value
// Forces consumers to be wrapped in provider
const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

// Provider component that wraps the app and provides crypto-related state
export function CryptoProvider({ children }: { children: React.ReactNode }) {
  // State management for file handling
  const [file, setFile] = useState<File | null>(null);
  
  // State for tracking encryption/decryption progress
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for toast notifications
  const [toast, setToast] = useState<{ 
    message: string; 
    type: 'success' | 'error' 
  } | null>(null);

  // Helper function to show toast notifications
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  return (
    <CryptoContext.Provider value={{ 
      file, 
      setFile, 
      isProcessing, 
      setIsProcessing, 
      showToast 
    }}>
      {children}
      {/* Render toast notification when present */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </CryptoContext.Provider>
  );
}

// Custom hook for accessing crypto context
// Throws error if used outside provider
export function useCrypto() {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
} 
'use client';

import { useState } from 'react';
import { Upload, X, AlertCircle, Loader2 } from 'lucide-react';  // UI icons
import { clsx } from 'clsx';  // Utility for conditional class names
import { useCrypto } from '@/contexts/CryptoContext';

// Constants for file validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB size limit
const ALLOWED_FILE_TYPES = [
  'text/plain',           // .txt files
  'application/pdf',      // .pdf files
  'application/json',     // .json files
  'application/xml',      // .xml files
  'application/msword',   // .doc files
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx files
];

// Type definition for file validation errors
interface FileError {
  message: string;  // Error message to display
  type: 'size' | 'type';  // Type of validation failure
}

export function FileUpload() {
  // Access global crypto context
  const { setFile: setContextFile } = useCrypto();
  
  // Local state management
  const [file, setFile] = useState<File | null>(null);          // Currently selected file
  const [error, setError] = useState<FileError | null>(null);   // Validation error state
  const [isLoading, setIsLoading] = useState(false);            // Loading state
  const [dragActive, setDragActive] = useState(false);          // Drag state for UI feedback

  // Validates file against size and type restrictions
  const validateFile = (file: File): FileError | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        type: 'size',
        message: 'File size must be less than 10MB'
      };
    }
    
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        type: 'type',
        message: 'Invalid file type. Please upload a document file.'
      };
    }

    return null;
  };

  // Handles file selection and validation
  const handleFile = (file: File) => {
    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      setFile(null);
      setContextFile(null);
      return;
    }
    
    setError(null);
    setFile(file);
    setContextFile(file);
  };

  // Handles drag events for visual feedback
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handles file drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handles file input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Removes selected file
  const removeFile = () => {
    setFile(null);
    setContextFile(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Upload File</h2>
      
      {/* Drag and drop zone */}
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-white/10',  // Active drag state
          error ? 'border-red-500/50 bg-red-500/5' : '',                  // Error state
          isLoading ? 'pointer-events-none opacity-50' : ''               // Loading state
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          disabled={isLoading}
        />
        
        {/* Upload UI */}
        <div className="space-y-3">
          {isLoading ? (
            <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" />
          ) : (
            <Upload className="mx-auto h-8 w-8 text-foreground/40" />
          )}
          
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-foreground/60">
              Supported: TXT, JSON, XML (Max 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <p>{error.message}</p>
        </div>
      )}

      {/* Selected file display */}
      {file && !error && (
        <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-white/10">
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-foreground/60">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
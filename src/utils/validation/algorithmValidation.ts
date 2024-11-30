// Algorithm Validation Implementation
// Provides validation rules for each encryption algorithm's parameters
// Returns validation errors when parameters don't meet requirements

interface ValidationError {
  message: string;  // Human-readable error message
  field: string;    // Which parameter failed validation
}

// Validates shift parameter for monoalphabetic cipher
export function validateMonoalphabetic(shift: number): ValidationError | null {
  // Ensure shift is a valid number
  if (typeof shift !== 'number' || isNaN(shift)) {
    return { message: 'Shift must be a number', field: 'shift' };
  }
  // Ensure shift is within valid ASCII range
  if (shift < 1 || shift > 255) {
    return { message: 'Shift must be between 1 and 255', field: 'shift' };
  }
  return null;
}

// Validates key for polyalphabetic cipher
export function validatePolyalphabetic(key: string): ValidationError | null {
  // Check for key presence and type
  if (!key || typeof key !== 'string') {
    return { message: 'Key is required', field: 'key' };
  }
  // Ensure minimum key length for security
  if (key.length < 2) {
    return { message: 'Key must be at least 2 characters long', field: 'key' };
  }
  return null;
}

// Validates key for Vigenère cipher
export function validateVigenere(key: string): ValidationError | null {
  // Similar validation as polyalphabetic
  if (!key || typeof key !== 'string') {
    return { message: 'Key is required', field: 'key' };
  }
  if (key.length < 2) {
    return { message: 'Key must be at least 2 characters long', field: 'key' };
  }
  return null;
}

// Validates key for transpositional cipher
export function validateTranspositional(key: string): ValidationError | null {
  // Check for key presence and type
  if (!key || typeof key !== 'string') {
    return { message: 'Key is required', field: 'key' };
  }
  // Ensure key only contains valid characters
  if (!/^[A-Za-z0-9]+$/.test(key)) {
    return { message: 'Key must contain only letters and numbers', field: 'key' };
  }
  // Ensure minimum key length for security
  if (key.length < 2) {
    return { message: 'Key must be at least 2 characters long', field: 'key' };
  }
  return null;
}

// Validates RSA public key format
export function validateRSAPublicKey(key: string): ValidationError | null {
  try {
    // Attempt to parse the key as JSON
    const parsed = JSON.parse(key);
    // Check for required fields
    if (!parsed.e || !parsed.n) {
      return { message: 'Invalid public key format', field: 'publicKey' };
    }
    // Ensure key values are numbers
    if (typeof parsed.e !== 'number' || typeof parsed.n !== 'number') {
      return { message: 'Invalid key values', field: 'publicKey' };
    }
  } catch {
    // If parsing fails, return format error
    return { message: 'Invalid public key format', field: 'publicKey' };
  }
  return null;
}

// Validates RSA private key format
export function validateRSAPrivateKey(key: string): ValidationError | null {
  try {
    // Attempt to parse the key as JSON
    const parsed = JSON.parse(key);
    // Check for required fields
    if (!parsed.d || !parsed.n) {
      return { message: 'Invalid private key format', field: 'privateKey' };
    }
    // Ensure key values are numbers
    if (typeof parsed.d !== 'number' || typeof parsed.n !== 'number') {
      return { message: 'Invalid key values', field: 'privateKey' };
    }
  } catch {
    // If parsing fails, return format error
    return { message: 'Invalid private key format', field: 'privateKey' };
  }
  return null;
}

// Validates Vernam key format
export function validateVernamKey(key: string, textLength: number): ValidationError | null {
  // Check for key presence and type
  if (!key || typeof key !== 'string') {
    return { message: 'Key is required', field: 'key' };
  }
  // Ensure key length matches text length
  if (key.length !== textLength) {
    return { 
      message: `Key length must match text length (${textLength} characters)`, 
      field: 'key' 
    };
  }
  // Ensure key only contains uppercase letters
  if (!/^[A-Z]+$/.test(key)) {
    return { message: 'Key must contain only uppercase letters', field: 'key' };
  }
  return null;
} 
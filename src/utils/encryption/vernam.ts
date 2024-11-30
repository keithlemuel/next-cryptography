// Vernam Cipher (One-Time Pad) implementation
// A theoretically unbreakable cipher when used correctly
// Requires a truly random key that is:
// 1. As long as the message
// 2. Never reused
// 3. Kept completely secret

// Helper function to generate random keys (Note: not cryptographically secure)
export function generateKey(length: number): string {
  return Array.from(
    { length }, 
    // Generate random uppercase letters (A-Z)
    () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  ).join('');
}

export function vernamEncrypt(text: string): { encrypted: string; key: string } {
  // Generate a random key of bytes, one for each character in the text
  const key = Array.from(
    { length: text.length }, 
    () => Math.floor(Math.random() * 256)
  );
  
  // XOR each character with corresponding key byte
  const encrypted = text
    .split('')
    .map((char, i) => {
      const code = char.charCodeAt(0);
      // XOR operation (^) provides perfect secrecy when key is random
      return String.fromCharCode(code ^ key[i]);
    })
    .join('');

  // Convert key to base64 for safe storage/transmission
  const keyString = Buffer.from(key).toString('base64');
  return { encrypted, key: keyString };
}

export function vernamDecrypt(text: string, keyString: string): string {
  // Convert key back from base64 to array of numbers
  const key = Array.from(Buffer.from(keyString, 'base64'));
  
  // XOR operation is its own inverse, so we apply the same operation to decrypt
  return text
    .split('')
    .map((char, i) => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code ^ key[i]);
    })
    .join('');
} 
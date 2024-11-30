// Polyalphabetic cipher implementation
// Similar to monoalphabetic, but uses multiple shift values that rotate based on a key
// This provides better security than monoalphabetic as it obscures character frequency patterns

export function polyalphabeticEncrypt(text: string, key: string): string {
  // Convert each character in the key to its ASCII code to use as shift values
  const shifts = key.split('').map(char => char.charCodeAt(0));
  
  return text
    .split('')
    .map((char, i) => {
      const code = char.charCodeAt(0);
      // Use modulo to cycle through the shifts array
      const shift = shifts[i % shifts.length];
      // Apply the shift and wrap around using modulo 256
      return String.fromCharCode((code + shift) % 256);
    })
    .join('');
}

export function polyalphabeticDecrypt(text: string, key: string): string {
  // Create the same shift pattern as used in encryption
  const shifts = key.split('').map(char => char.charCodeAt(0));
  
  return text
    .split('')
    .map((char, i) => {
      const code = char.charCodeAt(0);
      const shift = shifts[i % shifts.length];
      // Reverse the shift operation, adding 256 to handle negative values
      return String.fromCharCode((code - shift + 256) % 256);
    })
    .join('');
} 
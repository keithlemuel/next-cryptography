// Vigenère cipher implementation
// A polyalphabetic substitution cipher that uses a keyword to shift characters
// Similar to polyalphabetic, but historically significant and named after Blaise de Vigenère

export function vigenereEncrypt(text: string, key: string): string {
  // Convert each character in the key to its ASCII code to create shift pattern
  const shifts = key.split('').map(char => char.charCodeAt(0));
  
  return text
    .split('')
    .map((char, i) => {
      const code = char.charCodeAt(0);
      // Use modulo to cycle through the shifts array (repeating the key)
      const shift = shifts[i % shifts.length];
      // Apply shift and wrap around using modulo 256 for full ASCII range
      return String.fromCharCode((code + shift) % 256);
    })
    .join('');
}

export function vigenereDecrypt(text: string, key: string): string {
  // Create the same shift pattern from the key
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
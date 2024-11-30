// Simple substitution cipher implementation
// Each character in the text is shifted by a fixed number of positions in the ASCII table

export function monoalphabeticEncrypt(text: string, shift: number): string {
  return text
    .split('')  // Convert string to array of characters
    .map(char => {
      const code = char.charCodeAt(0);  // Get ASCII code of character
      return String.fromCharCode((code + shift) % 256);  // Shift character and wrap around at 256
    })
    .join('');  // Combine characters back into string
}

export function monoalphabeticDecrypt(text: string, shift: number): string {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      // Add 256 before subtracting to handle negative shifts
      return String.fromCharCode((code - shift + 256) % 256);
    })
    .join('');
} 
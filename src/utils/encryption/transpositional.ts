// Transpositional (Columnar Transposition) Cipher implementation
// Instead of substituting characters, this cipher rearranges them based on a key
// The key determines the order in which columns are arranged

export function transpositionalEncrypt(text: string, key: string): string {
  // Clean the key: remove special characters and convert to lowercase
  const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (!cleanKey) throw new Error('Invalid key');

  // Create a mapping of positions based on alphabetical order of key characters
  // Example: key "HACK" becomes [2,0,1,3] because A=0,C=1,H=2,K=3
  const keyOrder = cleanKey
    .split('')
    .map((char, index) => ({ char, index }))
    .sort((a, b) => a.char.localeCompare(b.char))
    .map(item => item.index);

  const blockSize = cleanKey.length;
  const blocks: string[][] = [];
  
  // Split text into blocks of size equal to key length
  for (let i = 0; i < text.length; i += blockSize) {
    const block = text.slice(i, i + blockSize).split('');
    // Pad incomplete blocks with null characters
    while (block.length < blockSize) {
      block.push('\0');
    }
    blocks.push(block);
  }

  // Apply transposition to each block according to key order
  return blocks.map(block => {
    const transposed = new Array(blockSize);
    keyOrder.forEach((newPos, oldPos) => {
      transposed[newPos] = block[oldPos];
    });
    return transposed.join('');
  }).join('');
}

export function transpositionalDecrypt(text: string, key: string): string {
  const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (!cleanKey) throw new Error('Invalid key');

  // Create the same key order mapping as in encryption
  const keyOrder = cleanKey
    .split('')
    .map((char, index) => ({ char, index }))
    .sort((a, b) => a.char.localeCompare(b.char))
    .map(item => item.index);

  const blockSize = cleanKey.length;
  const blocks: string[][] = [];

  // Split ciphertext into blocks
  for (let i = 0; i < text.length; i += blockSize) {
    blocks.push(text.slice(i, i + blockSize).split(''));
  }

  // Create inverse mapping to restore original positions
  const inverseKeyOrder = new Array(blockSize);
  keyOrder.forEach((newPos, oldPos) => {
    inverseKeyOrder[newPos] = oldPos;
  });

  // Apply inverse transposition to each block
  return blocks.map(block => {
    const transposed = new Array(blockSize);
    inverseKeyOrder.forEach((newPos, oldPos) => {
      transposed[newPos] = block[oldPos];
    });
    return transposed.join('');
  }).join('').replace(/\0+$/, ''); // Remove padding null characters
} 
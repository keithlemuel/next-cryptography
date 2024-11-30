function gcd(a: bigint, b: bigint): bigint {
  while (b !== BigInt(0)) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function modInverse(a: bigint, m: bigint): bigint {
  let m0 = m;
  let x0 = BigInt(0);
  let x1 = BigInt(1);

  if (m === BigInt(1)) return BigInt(0);

  while (a > BigInt(1)) {
    const q = a / m;
    let t = m;

    m = a % m;
    a = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < BigInt(0)) x1 += m0;

  return x1;
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === BigInt(1)) return BigInt(0);
  let result = BigInt(1);
  base = base % modulus;
  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2) === BigInt(1)) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> BigInt(1);
    base = (base * base) % modulus;
  }
  return result;
}

export function generateRSAKeys() {
  const p = BigInt(61);
  const q = BigInt(53);
  const n = p * q;
  const phi = (p - BigInt(1)) * (q - BigInt(1));
  
  let e = BigInt(17);
  while (gcd(e, phi) !== BigInt(1)) {
    e += BigInt(2);
  }
  
  const d = modInverse(e, phi);

  return {
    publicKey: JSON.stringify({ e: e.toString(), n: n.toString() }),
    privateKey: JSON.stringify({ d: d.toString(), n: n.toString() })
  };
}

// RSA (Rivest-Shamir-Adleman) Public Key Cryptosystem Implementation
// This is an asymmetric encryption algorithm that uses:
// - A public key for encryption (can be shared)
// - A private key for decryption (must be kept secret)

export function rsaEncrypt(text: string, publicKey: { e: string | number; n: string | number }): string {
  if (!text) throw new Error('No text to encrypt');
  if (!publicKey?.e || !publicKey?.n) throw new Error('Invalid public key');

  // Convert key components to BigInt for large number calculations
  const e = BigInt(publicKey.e);  // Public exponent
  const n = BigInt(publicKey.n);  // Modulus (n = p * q, where p and q are large primes)
  
  // Convert text to bytes and encrypt each byte separately
  const bytes = Buffer.from(text);
  const encrypted = Array.from(bytes).map(byte => {
    // RSA encryption formula: c = m^e mod n
    // where: c = ciphertext, m = message, e = public exponent, n = modulus
    return modPow(BigInt(byte), e, n).toString();
  });

  // Join encrypted bytes with commas for transmission
  return encrypted.join(',');
}

export function rsaDecrypt(encrypted: string, privateKey: { d: string | number; n: string | number }): string {
  if (!encrypted) throw new Error('No data to decrypt');
  if (!privateKey?.d || !privateKey?.n) throw new Error('Invalid private key');

  // Convert key components to BigInt
  const d = BigInt(privateKey.d);  // Private exponent
  const n = BigInt(privateKey.n);  // Modulus (same as in public key)

  // Split encrypted string and decrypt each number
  const bytes = encrypted.split(',').map(num => {
    // RSA decryption formula: m = c^d mod n
    // where: m = message, c = ciphertext, d = private exponent, n = modulus
    const decrypted = modPow(BigInt(num), d, n);
    return Number(decrypted);
  });

  // Convert decrypted bytes back to string
  return Buffer.from(bytes).toString();
}
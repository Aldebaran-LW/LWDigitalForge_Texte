const PASSWORD_PREFIX = 'pbkdf2$sha256';
const ITERATIONS = 120000;

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function deriveHash(password, saltBytes, iterations) {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const bits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return new Uint8Array(bits);
}

function safeEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

export async function hashVaultPassword(password) {
  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const hashBytes = await deriveHash(password, saltBytes, ITERATIONS);

  return `${PASSWORD_PREFIX}$${ITERATIONS}$${bytesToBase64(saltBytes)}$${bytesToBase64(hashBytes)}`;
}

export async function verifyVaultPassword(password, encodedHash) {
  if (!encodedHash || !encodedHash.startsWith(`${PASSWORD_PREFIX}$`)) {
    return false;
  }

  const [, , iterationValue, saltBase64, hashBase64] = encodedHash.split('$');
  const iterations = Number(iterationValue);

  if (!iterations || !saltBase64 || !hashBase64) {
    return false;
  }

  const saltBytes = base64ToBytes(saltBase64);
  const expectedHash = base64ToBytes(hashBase64);
  const candidateHash = await deriveHash(password, saltBytes, iterations);

  return safeEqual(candidateHash, expectedHash);
}

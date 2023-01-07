export interface Decrypter {
  decrypt(ciphertext: string): string | null;
}

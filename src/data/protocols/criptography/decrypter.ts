export interface Decrypter {
  decrypt(token: string): string | null;
}

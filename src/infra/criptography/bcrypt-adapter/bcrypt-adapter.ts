import bcrypt from 'bcrypt';
import { Hasher } from '@/data/protocols/criptography/hasher';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(plaintext: string): Promise<string> {
    const digest = await bcrypt.hash(plaintext, this.salt);
    return digest;
  }

  async compare(plaitext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaitext, digest);
    return isValid;
  }
}

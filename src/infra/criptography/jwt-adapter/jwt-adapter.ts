import jwt from 'jsonwebtoken';
import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { Encrypter } from '@/data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  encrypt(plaintext: string): string {
    const ciphertext = jwt.sign({ id: plaintext }, this.secret);
    return ciphertext;
  }

  decrypt(ciphertext: string): string {
    const plaintext: any = jwt.verify(ciphertext, this.secret);
    return plaintext;
  }
}

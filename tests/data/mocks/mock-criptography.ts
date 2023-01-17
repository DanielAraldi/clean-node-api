import { Hasher, HashComparer, Decrypter, Encrypter } from '@/data/protocols';
import { faker } from '@faker-js/faker';

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid();
  plaintext: string;

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return Promise.resolve(this.digest);
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string;
  digest: string;
  isValid = true;

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;
    return Promise.resolve(this.isValid);
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.datatype.uuid();
  plaintext: string;

  encrypt(plaintext: string): string {
    this.plaintext = plaintext;
    return this.ciphertext;
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext = faker.internet.password();
  ciphertext: string;

  decrypt(ciphertext: string): string {
    this.ciphertext = ciphertext;
    return this.plaintext;
  }
}

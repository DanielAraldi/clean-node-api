import jwt from "jsonwebtoken";
import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { Encrypter } from "@/data/protocols/criptography/encrypter";

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  encrypt(value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }

  decrypt(token: string): string {
    const value: any = jwt.verify(token, this.secret);
    return value;
  }
}

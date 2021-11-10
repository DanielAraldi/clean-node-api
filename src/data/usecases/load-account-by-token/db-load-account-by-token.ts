import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        token,
        role
      );
      if (account) {
        return account;
      }
    }
    return null;
  }
}

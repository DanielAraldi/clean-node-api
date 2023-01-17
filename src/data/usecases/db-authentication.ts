import { Authentication, AuthenticationParams } from '@/domain/usecases';
import { AuthenticationModel } from '@/domain/models';
import {
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(
    authenticationParams: AuthenticationParams
  ): Promise<AuthenticationModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authenticationParams.email
    );
    if (account) {
      const isValid = await this.hashComparer.compare(
        authenticationParams.password,
        account.password
      );
      if (isValid) {
        const accessToken = this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        );
        return { accessToken, name: account.name };
      }
    }
    return null;
  }
}

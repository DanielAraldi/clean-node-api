import { RefreshToken } from '@/domain/usecases';
import {
  Encrypter,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';

export class DbRefreshToken implements RefreshToken {
  constructor(
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async refresh(accessToken: string): Promise<RefreshToken.Result> {
    const account = await this.loadAccountByTokenRepository.loadByToken(
      accessToken
    );
    if (account) {
      const token = this.encrypter.encrypt(account.id);
      await this.updateAccessTokenRepository.updateAccessToken(
        account.id,
        token
      );
      return { accessToken: token };
    }
    return null;
  }
}

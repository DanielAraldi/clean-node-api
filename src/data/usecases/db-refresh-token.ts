import { RefreshToken } from '@/domain/usecases';
import { Encrypter, LoadAccountByTokenRepository } from '@/data/protocols';

export class DbRefreshToken implements RefreshToken {
  constructor(
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    private readonly encrypter: Encrypter
  ) {}

  async refresh(accessToken: string): Promise<RefreshToken.Result> {
    const account = await this.loadAccountByTokenRepository.loadByToken(
      accessToken
    );
    if (account) {
      this.encrypter.encrypt(account.id);
    }
    return Promise.resolve(null);
  }
}

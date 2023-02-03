import { RefreshToken } from '@/domain/usecases';
import { LoadAccountByTokenRepository } from '@/data/protocols';

export class DbRefreshToken implements RefreshToken {
  constructor(
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async refresh(accessToken: string): Promise<RefreshToken.Result> {
    await this.loadAccountByTokenRepository.loadByToken(accessToken);
    return Promise.resolve(null);
  }
}

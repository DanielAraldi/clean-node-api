import { DbRefreshToken } from '@/data/usecases';
import { RefreshToken } from '@/domain/usecases';
import { JwtAdapter } from '@/infra/criptography';
import { AccountMongoRepository } from '@/infra/db';
import env from '@/main/config/env';

export const makeDbRefreshToken = (): RefreshToken => {
  const accountMongoRepository = new AccountMongoRepository();
  const encrypter = new JwtAdapter(env.jwtSecret);
  return new DbRefreshToken(
    accountMongoRepository,
    encrypter,
    accountMongoRepository
  );
};

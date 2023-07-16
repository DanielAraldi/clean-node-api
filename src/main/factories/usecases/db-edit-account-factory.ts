import { DbEditAccount } from '@/data/usecases';
import { EditAccount } from '@/domain/usecases';
import { AccountMongoRepository } from '@/infra/db';

export const makeDbEditAccount = (): EditAccount => {
  const accountMongoRepository = new AccountMongoRepository();
  return new DbEditAccount(accountMongoRepository, accountMongoRepository);
};

import { EditAccount } from '@/domain/usecases';
import { CheckAccountByEmailRepository } from '@/data/protocols';

export class DbEditAccount implements EditAccount {
  constructor(
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async edit(account: EditAccount.Params): Promise<EditAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      account.email
    );
    if (exists) return false;
    return true;
  }
}

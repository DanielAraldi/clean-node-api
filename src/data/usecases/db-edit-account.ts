import { EditAccount } from '@/domain/usecases';
import {
  CheckAccountByEmailRepository,
  EditAccountRepository,
} from '@/data/protocols';

export class DbEditAccount implements EditAccount {
  constructor(
    private readonly editAccountRepository: EditAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async edit(account: EditAccount.Params): Promise<EditAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      account.email
    );
    if (exists) return false;
    await this.editAccountRepository.edit(account);
    return true;
  }
}

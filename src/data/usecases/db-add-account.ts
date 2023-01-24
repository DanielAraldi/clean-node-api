import { AddAccount } from '@/domain/usecases';
import {
  Hasher,
  AddAccountRepository,
  CheckAccountByEmailRepository,
} from '@/data/protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      data.email
    );
    let isValid = false;
    if (!exists) {
      const hashedPassword = await this.hasher.hash(data.password);
      isValid = await this.addAccountRepository.add({
        ...data,
        password: hashedPassword,
      });
    }
    return isValid;
  }
}

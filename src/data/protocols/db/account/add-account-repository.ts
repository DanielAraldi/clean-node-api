import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases';

export interface AddAccountRepository {
  add(data: AddAccountParams): Promise<AccountModel>;
}

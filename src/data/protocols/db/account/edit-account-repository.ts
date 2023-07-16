import { EditAccount } from '@/domain/usecases';

export interface EditAccountRepository {
  edit(data: EditAccountRepository.Params): Promise<void>;
}

export namespace EditAccountRepository {
  export type Params = EditAccount.Params;
}

export interface EditAccount {
  edit(account: EditAccount.Params): Promise<EditAccount.Result>;
}

export namespace EditAccount {
  export type Params = {
    name?: string;
    email?: string;
    accountId: string;
  };
  export type Result = boolean;
}

export interface LoadAccount {
  load(accessToken: string): Promise<LoadAccount.Result>;
}

export namespace LoadAccount {
  export type Result = { name: string; email: string; role?: string } | null;
}

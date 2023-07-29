export interface LoadAccount {
  load(accessToken: string): Promise<LoadAccount.Result>;
}

export namespace LoadAccount {
  export type Result = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    role?: string;
  } | null;
}

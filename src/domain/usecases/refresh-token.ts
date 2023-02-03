export interface RefreshToken {
  refresh(accessToken: string): Promise<RefreshToken.Result>;
}

export namespace RefreshToken {
  export type Result = {
    accessToken: string;
    name: string;
  } | null;
}

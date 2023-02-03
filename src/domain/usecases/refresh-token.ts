export interface RefreshToken {
  refresh(data: RefreshToken.Params): Promise<RefreshToken.Result>;
}

export namespace RefreshToken {
  export type Params = {
    accessToken: string;
  };
  export type Result = {
    accessToken: string;
    name: string;
  };
}

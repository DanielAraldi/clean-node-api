export type AuthenticationParams = {
  email: string;
  password: string;
};

export interface Authentication {
  auth(autentications: AuthenticationParams): Promise<string | null>;
}

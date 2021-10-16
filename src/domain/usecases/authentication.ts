export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  auth(autentications: AuthenticationModel): Promise<string>
}

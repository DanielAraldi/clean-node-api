import env from "../../../../config/env";
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account/account-mongo-repository";
import { JwtAdapter } from "../../../../../infra/criptography/jwt-adapter/jwt-adapter";
import { DbLoadAccountByToken } from "../../../../../data/usecases/load-account-by-token/db-load-account-by-token";
import { LoadAccountByToken } from "../../../../../domain/usecases/load-account-by-token";

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};

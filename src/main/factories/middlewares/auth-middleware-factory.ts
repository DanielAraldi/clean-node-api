import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { Middleware } from "@/presentation/protocols";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbLoadAccountByToken } from "@/main/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory";

export const makeAuthMiddleware = (role?: string): Middleware => {
  const authMiddleware = new AuthMiddleware(makeDbLoadAccountByToken(), role);
  return makeLogControllerDecorator(authMiddleware);
};

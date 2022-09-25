import { loginPath } from "./paths/login-path";
import { accountSchema } from "./schemas/account-schema";
import { loginParamsSchema } from "./schemas/login-params-schema";

export default {
  openapi: "3.0.0",
  info: {
    title: "Clean Node API",
    description:
      "API em NodeJs usando Typescript, TDD, Clean Architecture, Design Patterns e SOLID principles.",
    version: "1.0.0",
  },
  servers: [{ url: "/api" }],
  tags: [{ name: "Login" }],
  paths: {
    "/login": loginPath,
  },
  schemas: { account: accountSchema, loginParams: loginParamsSchema },
};

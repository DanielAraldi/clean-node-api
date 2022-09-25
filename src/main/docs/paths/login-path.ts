export const loginPath = {
  post: {
    tags: ["Login"],
    summary: "Realiza o login do usuário.",
    description:
      "Realiza o login do usuário no sistema e retorna um token de acesso.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/loginParams",
          },
        },
      },
    },
    responses: {
      200: {
        description: "Sucesso!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/account",
            },
          },
        },
      },
    },
  },
};

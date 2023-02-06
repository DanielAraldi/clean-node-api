# Refresh Token

> ## Caso de sucesso:

1. ⛔ Recebe uma requisição do tipo **POST** na rota **/api/refresh**.
1. ✅ Valida dado obrigatório **accessToken**.
1. ✅ Busca o usuário com o token de acesso fornecido.
1. ✅ Gera um novo token de acesso a partir do ID do usuário.
1. ✅ Atualiza os dados do usuário com o token de acesso gerado.
1. ✅ Retorna **200** com o token de acesso do usuário.

> ## Exceções:

1. ✅ Retorna erro **404** se a API não existir.
1. ✅ Retorna erro **400** se **accessToken** não for fornecido pelo cliente.
1. ✅ Retorna erro **401** se não encontrar um usuário com o token de acesso fornecido.
1. ✅ Retorna erro **401** se o token de acesso fornecido estiver expirado.
1. ✅ Retorna erro **500** se der erro ao tentar gerar o token de acesso.
1. ✅ Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado.

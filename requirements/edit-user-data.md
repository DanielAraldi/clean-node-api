# Edição de Dados do Usuário

> ## Caso de sucesso:

1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/account/edit**.
1. ✅ Valida se os dados **name** e **email** não foram passados como `string` vazia.
1. ✅ Valida que o campo **email** é um e-mail válido.
1. ✅ Valida se já existe um usuário com o e-mail fornecido.
1. ✅ Edita a conta do usuário com os dados informados.
1. ✅ Retorna **204**.

> ## Exceções:

1. ✅ Retorna erro **404** se a API não existir.
1. ✅ Retorna erro **400** se **name** e **email** forem uma `string` vazia.
1. ✅ Retorna erro **400** se o campo **email** for um e-mail inválido.
1. ✅ Retorna erro **403** se o e-mail fornecido já estiver em uso.
1. ✅ Retorna erro **403** se não for um **usuário**.
1. ✅ Retorna erro **500** se der erro ao tentar editar a conta do usuário.

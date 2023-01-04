# Responder enquete

> ## Caso de sucesso:

1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{surveyId}/results**
1. ✅ Valida se a requisição foi feita por um **usuário**
1. ✅ Valida o parâmetro **surveyId**
1. ✅ Valida se o campo **answerId** é uma resposta válida
1. ✅ **Cria** um resultado de enquete com os dados fornecidos caso não tenha um registro
1. ✅ **Atualiza** um resultado de enquete com os dados fornecidos caso já tenha um registro
1. ✅ Retorna **200** com os dados do resultado da enquete

> ## Exceções:

1. ✅ Retorna erro **404** se a API não existir
1. ✅ Retorna erro **403** se não for um **usuário**
1. ✅ Retorna erro **403** se o **surveyId** passado na URL for inválido
1. ✅ Retorna erro **403** se a resposta enviada pelo client for uma resposta inválida
1. ✅ Retorna erro **500** se der erro ao tentar criar o resultado da enquete
1. ✅ Retorna erro **500** se der erro ao tentar atualizar o resultado da enquete
1. ✅ Retorna erro **500** se der erro ao tentar carregar a enquete

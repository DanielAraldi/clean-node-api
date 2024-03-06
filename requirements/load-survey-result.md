# Survey Result

> ## Success Case:

1. Receives a request type **GET** on the **/api/surveys/{surveyId}/results** route.
2. Validate if the request was made by a **user**.
3. Returns **200** with the survey result data.

> ## Exception:

1. Return **404** error if API doesn't exists.
2. Return **403** error if not a **user**.
3. Return **500** error if an error occurred when load survey result.

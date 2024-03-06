# Create Survey

> ## Success case:

1. Receives a request type **POST** on the **/api/surveys** route.
2. Validate if the request was made by an **admin**.
3. Validate required data **question**, **answers** and **answer**.
4. Create a survey with the data provided.
5. Return **204**.

> ## Exceptions:

1. Return a **404** error if the API doesn't exists.
2. Return a **403** if the user isn't an **admin**.
3. Return a **400** if **question** or **answers** weren't provided by client.
4. Return a **500** if an error happens when trying to create a survey.

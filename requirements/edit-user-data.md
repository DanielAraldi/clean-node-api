# Edit User Data

> ## Success Case:

1. Receives a request type **PUT** on the **/api/account/edit** route.
2. Validate if the data **name** and **email** weren't provided like blank `string`.
3. Validate if the **email** field is a valid email.
4. Validate if already have a user with email provided.
5. Edit the user account with data provided.
6. Return **204**.

> ## Exceptions:

1. Return **404** error if API doesn't exists.
2. Return **400** error if **name** and **email** were a blank `string`.
3. Return **400** error if the **email** field to be an invalid email.
4. Return **403** error if the email provided is already in use.
5. Return **403** error if wasn't a **user**.
6. Return **500** error if an error occurred during editing.

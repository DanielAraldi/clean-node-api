import { AccountModel } from "@/domain/models/account";
import { AddAccountParams } from "@/domain/usecases/account/add-account";

export const mockAccountModel = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_mail@mail.com",
  password: "any_password",
});

export const mockAddAccountParams = (): AddAccountParams => ({
  name: "any_name",
  email: "any_mail@mail.com",
  password: "any_password",
});

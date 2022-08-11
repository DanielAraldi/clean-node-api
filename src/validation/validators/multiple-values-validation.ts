import { MissingParamError } from "@/presentation/errors";
import { Validation } from "@/presentation/protocols";

export class MultipleValuesValidation implements Validation {
  constructor(
    private readonly objectFieldName: string,
    private readonly validations: Validation[]
  ) {}

  validate(input: any): Error | null {
    if (!input[this.objectFieldName]) {
      return new MissingParamError(this.objectFieldName);
    }
    return null;
  }
}

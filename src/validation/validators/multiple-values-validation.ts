import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';

export class MultipleValuesValidation implements Validation {
  constructor(
    private readonly objectFieldName: string,
    private readonly validations: Validation[]
  ) {}

  validate(input: any): Error | null {
    if (!input[this.objectFieldName]) {
      return new MissingParamError(this.objectFieldName);
    }

    for (const validation of this.validations) {
      for (const fieldName of input[this.objectFieldName]) {
        const error = validation.validate(fieldName);
        if (error) {
          return error;
        }
      }
    }
    return null;
  }
}

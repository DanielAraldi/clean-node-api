import { Validation } from '@/presentation/protocols';
import { MissingParamError } from '@/presentation/errors';

export class AlmostRequiredFieldValidation implements Validation {
  constructor(private readonly fieldNames: string[]) {}

  validate(input: any): Error | null {
    const fieldNames: string[] = [];
    for (const fieldName of this.fieldNames) {
      if (!input[fieldName]) {
        fieldNames.push(fieldName);
      }
    }

    if (this.fieldNames.length === fieldNames.length) {
      const message =
        fieldNames.length === 1 ? fieldNames[0] : fieldNames.join(' or ');
      return new MissingParamError(message);
    }

    return null;
  }
}

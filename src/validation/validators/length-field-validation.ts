import { Validation } from '@/presentation/protocols';
import { InvalidLengthError } from '@/presentation/errors';

export class LengthFieldValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly greaterAndEqual: number
  ) {}

  validate(input: any): Error | null {
    if (input[this.fieldName].length >= this.greaterAndEqual) {
      return null;
    }
    return new InvalidLengthError(this.fieldName);
  }
}

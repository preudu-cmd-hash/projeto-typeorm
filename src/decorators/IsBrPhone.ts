import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isBrPhone", async: false })
export class IsBrPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "string") return false;

    const phoneRegex = /^\(?\d{2}\)?\s?9\d{4}\-?\d{4}$/;

    return phoneRegex.test(value);
  }

  defaultMessage(args?: ValidationArguments): string {
    return `O número de telefone ${args?.value} não é um número válido (XX) 9XXXX-XXXX`;
  }
}

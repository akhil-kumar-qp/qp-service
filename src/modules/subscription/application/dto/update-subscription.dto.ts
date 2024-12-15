import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import {
  isGreaterThanOrEqualToCurrentYear,
  isValidCreditCardCSV,
  isValidCreditCardNumber,
} from '../../utility/update-subscription-dto-validations.utility';

export class UpdateSubscriptionDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(64)
  @MaxLength(64)
  patmentGatewayInitToken: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate((value: string) => isValidCreditCardNumber(value))
  cardNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @Validate((value: string) => isValidCreditCardCSV(value))
  cvv: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(11)
  month: number;

  @IsNumber()
  @IsNotEmpty()
  @Validate((value: number) => isGreaterThanOrEqualToCurrentYear(value))
  year: number;
}

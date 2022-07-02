import { IsNotEmpty, IsNumber } from 'class-validator';

export class IncreaseBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

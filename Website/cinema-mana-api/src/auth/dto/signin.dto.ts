import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsNotEmpty()
  password: string;
}

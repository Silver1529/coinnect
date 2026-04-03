import { IsEmail } from 'class-validator';

export class ProfileByEmailDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;
}

import { IsEmail, IsString } from 'class-validator';

export class UpdateProfilePhotoDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  profileImageUrl: string;
}

import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ProfileByEmailDto } from './dto/profile-by-email.dto';
import { UpdateProfilePhotoDto } from './dto/update-profile-photo.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Dados recebidos no Controller:', createUserDto);
    
    const newUser = await this.usersService.create(createUserDto);
    
    return {
      message: 'Usuário criado com sucesso!',
      user: newUser,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('migrate-passwords')
  @HttpCode(HttpStatus.OK)
  async migratePasswords() {
    const migratedCount = await this.usersService.migratePlainTextPasswords();

    return {
      message: 'Migracao executada com sucesso',
      migratedCount,
    };
  }

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  async getProfileByEmail(@Body() profileByEmailDto: ProfileByEmailDto) {
    return this.usersService.getProfileByEmail(profileByEmailDto.email);
  }

  @Patch('profile-photo')
  @HttpCode(HttpStatus.OK)
  async updateProfilePhoto(@Body() updateProfilePhotoDto: UpdateProfilePhotoDto) {
    return this.usersService.updateProfilePhoto(updateProfilePhotoDto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordDto);
  }
}
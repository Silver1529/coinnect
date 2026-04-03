import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateProfilePhotoDto } from './dto/update-profile-photo.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async onModuleInit(): Promise<void> {
    await this.migratePlainTextPasswords();
  }

  async migratePlainTextPasswords(): Promise<number> {
    const usersWithPlainPassword = await this.userModel
      .find({ password: { $not: /^\$2[aby]\$/ } })
      .select('+password')
      .exec();

    if (usersWithPlainPassword.length === 0) {
      return 0;
    }

    for (const user of usersWithPlainPassword) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await user.save();
    }

    this.logger.warn(
      `Migracao concluida: ${usersWithPlainPassword.length} senha(s) em texto puro foram convertidas para hash.`,
    );

    return usersWithPlainPassword.length;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('E-mail ja cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    savedUser.password = undefined as never;
    return savedUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel
      .findOne({ email: loginUserDto.email })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha invalidos');
    }

    const passwordIsValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('E-mail ou senha invalidos');
    }

    const token = randomBytes(32).toString('hex');

    return {
      message: 'Login realizado com sucesso!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl || '',
      },
    };
  }

  async getProfileByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl || '',
    };
  }

  async updateProfilePhoto(updateProfilePhotoDto: UpdateProfilePhotoDto) {
    const { email, profileImageUrl } = updateProfilePhotoDto;

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { email },
        { profileImageUrl },
        { new: true, runValidators: true },
      )
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return {
      message: 'Foto de perfil atualizada com sucesso!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl || '',
      },
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, currentPassword, newPassword } = changePasswordDto;

    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual invalida');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return {
      message: 'Senha alterada com sucesso!',
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }
}

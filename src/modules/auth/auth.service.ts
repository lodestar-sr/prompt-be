import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import ms from 'ms';

import { SuccessDto } from '@/common/dto/success.dto';
import { UserLockedException } from '@/common/exceptions/user-locked.exception';
import { SecurityConfig } from '@/config/configuration';

import { PasswordService } from '../common/password.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async signUp(dto: SignUpDto): Promise<SuccessDto> {
    const user = await this.userService.findOne({
      where: { email: dto.email },
    });
    if (user) {
      throw new ConflictException('Email already exists');
    }
    dto.password = await this.passwordService.hash(dto.password);
    await this.userService.repository.save(dto);
    return { success: true };
  }

  async signIn(dto: SignInDto): Promise<AuthDto> {
    const user = await this.userService.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (user.isLocked()) {
      throw new UserLockedException();
    }

    const isValid = await this.passwordService.validate(
      dto.password,
      user.password,
    );

    if (!isValid) {
      user.incrementFailedLoginAttempts();
      await this.userService.repository.update(user.id, user);
      throw new BadRequestException('Invalid email or password');
    }

    user.resetFailedLoginAttempts();
    await this.userService.repository.update(user.id, user);

    return {
      user: this.mapper.map(user, User, UserDto),
      ...this.generateTokens({ userId: user.id }),
    };
  }

  async refreshToken(token: string): Promise<TokenDto> {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return this.generateTokens({ userId });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private generateTokens(payload: { userId: string }): TokenDto {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresAt: dayjs()
        .add(ms(securityConfig.expiresIn), 'milliseconds')
        .valueOf(),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: securityConfig.expiresIn,
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }
}

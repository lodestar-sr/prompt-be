import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { SuccessDto } from '@/common/dto/success.dto';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign Up', operationId: 'signUp' })
  @ApiResponse({ status: 201, description: 'Success', type: SuccessDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  async signUp(@Body() dto: SignUpDto): Promise<SuccessDto> {
    return await this.authService.signUp(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 30000 } })
  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign In', operationId: 'signIn' })
  @ApiResponse({ status: 201, description: 'Success', type: AuthDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async signIn(@Body() dto: SignInDto): Promise<AuthDto> {
    return await this.authService.signIn(dto);
  }

  @Throttle({ default: { limit: 1, ttl: 600000 } })
  @Post('/token/refresh')
  @ApiOperation({ summary: 'Refresh Token', operationId: 'refreshToken' })
  @ApiResponse({ status: 201, description: 'Success', type: TokenDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokenDto> {
    return await this.authService.refreshToken(dto.token);
  }
}

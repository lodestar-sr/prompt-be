import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';

import { SecurityConfig } from '@/config/configuration';

@Injectable()
export class PasswordService {
  get bcryptSaltRounds() {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return securityConfig.bcryptSaltRounds;
  }

  constructor(private readonly configService: ConfigService) {}

  validate(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hash(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}

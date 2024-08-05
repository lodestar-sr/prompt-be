import { HttpException, HttpStatus } from '@nestjs/common';

export class UserLockedException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'This account is locked. Please try again later.',
      HttpStatus.FORBIDDEN,
    );
  }
}

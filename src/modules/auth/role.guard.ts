import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { some } from 'lodash';

import { Role } from '@/common/enums/role.enum';

import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const foundUser = await this.userService.findOne({
      where: { id: user.id },
    });
    if (!foundUser) {
      return false;
    }

    return some(requiredRoles, (r) => r === foundUser.role);
  }
}

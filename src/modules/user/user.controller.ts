import { Mapper } from '@automapper/core';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { PasswordService } from '../common/password.service';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Crud({
  model: { type: UserDto },
  query: { alwaysPaginate: true },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
  },
})
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    public readonly service: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  @Override('getManyBase')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get Users', operationId: 'getUsers' })
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<GetManyDefaultResponse<UserDto>> {
    let result = await this.service.getMany(req);
    result = result as GetManyDefaultResponse<User>;
    return {
      ...result,
      data: this.mapper.mapArray(result.data, User, UserDto),
    };
  }

  @Override('getOneBase')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get User', operationId: 'getUser' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseInterceptors(MapInterceptor(User, UserDto))
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.service.getOne(req);
  }

  @Override('createOneBase')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create A New User', operationId: 'createUser' })
  @ApiCreatedResponse({ description: 'Success', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @UseInterceptors(MapInterceptor(User, UserDto))
  async create(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUpdateUserDto,
  ) {
    return this.service.createOne(req, dto);
  }

  @Override('updateOneBase')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update User', operationId: 'updateUser' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @UseInterceptors(MapInterceptor(User, UserDto))
  async update(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateUpdateUserDto,
  ) {
    return this.service.updateOne(req, dto);
  }

  @Override('deleteOneBase')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete User', operationId: 'deleteUser' })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  delete(@ParsedRequest() req: CrudRequest) {
    return this.service.deleteOne(req);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Post(':id/reset-password')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Reset Password', operationId: 'resetPassword' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseInterceptors(MapInterceptor(User, UserDto))
  async resetPassword(
    @ParsedRequest() req: CrudRequest,
    @Body() dto: ResetPasswordDto,
  ) {
    const user = await this.service.getOne(req);
    user.password = await this.passwordService.hash(dto.password);
    return this.service.updateOne(req, user);
  }
}

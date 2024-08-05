import { Mapper } from '@automapper/core';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Request,
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
import { map, some } from 'lodash';

import { Roles } from '@/common/decorators/roles.decorator';
import { SuccessDto } from '@/common/dto/success.dto';
import { Role } from '@/common/enums/role.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { User } from '../user/entities/user.entity';
import { CreateUpdatePromptDto } from './dto/create-update-prompt.dto';
import { PromptDto } from './dto/prompt.dto';
import { Prompt } from './entities/prompt.entity';
import { PromptService } from './prompt.service';

@Crud({
  model: { type: PromptDto },
  query: {
    alwaysPaginate: true,
    exclude: ['id'],
    join: {
      createdBy: {
        eager: true,
        allow: ['id', 'firstName', 'lastName'],
      },
      favoritedBy: {
        eager: true,
      },
      'favoritedBy.user': {
        eager: true,
      },
    },
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
  },
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
@ApiTags('Prompts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('prompts')
export class PromptController implements CrudController<Prompt> {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    public readonly service: PromptService,
  ) {}

  @Override('getManyBase')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Get Prompts', operationId: 'getPrompts' })
  async getMany(
    @Request() req,
    @ParsedRequest() crudReq: CrudRequest,
  ): Promise<GetManyDefaultResponse<PromptDto>> {
    const user = req.user as User;
    let result = await this.service.getMany(crudReq);
    result = result as GetManyDefaultResponse<Prompt>;
    return {
      ...result,
      data: map(result.data, (i) => {
        const promptDto = this.mapper.map(i, Prompt, PromptDto);
        promptDto.isFavorite = some(
          i.favoritedBy,
          (u) => u.user.id === user.id,
        );
        return promptDto;
      }),
    };
  }

  @Override('getOneBase')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Get Prompt', operationId: 'getPrompt' })
  @ApiOkResponse({ type: PromptDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getOne(@Request() req, @ParsedRequest() crudReq: CrudRequest) {
    const user = req.user as User;
    const prompt = await this.service.getOne(crudReq);
    const promptDto = this.mapper.map(prompt, Prompt, PromptDto);
    promptDto.isFavorite = some(
      prompt.favoritedBy,
      (u) => u.user.id === user.id,
    );
    return promptDto;
  }

  @Override('createOneBase')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Create A New Prompt', operationId: 'createPrompt' })
  @ApiCreatedResponse({ description: 'Success', type: PromptDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  async create(
    @Request() req,
    @ParsedRequest() crudReq: CrudRequest,
    @ParsedBody() dto: CreateUpdatePromptDto,
  ) {
    const user = req.user as User;
    const prompt = await this.service.createOne(crudReq, {
      ...dto,
      createdBy: user,
    });
    const promptDto = this.mapper.map(prompt, Prompt, PromptDto);
    promptDto.isFavorite = some(
      prompt.favoritedBy,
      (u) => u.user.id === user.id,
    );
    return promptDto;
  }

  @Override('updateOneBase')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Update Prompt', operationId: 'updatePrompt' })
  @ApiOkResponse({ type: PromptDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @ParsedRequest() crudReq: CrudRequest,
    @ParsedBody() dto: CreateUpdatePromptDto,
  ) {
    const user = req.user as User;
    const promptExists = await this.service.findOne({
      where: { id, createdBy: { id: user.id } },
    });
    if (!promptExists) {
      throw new NotFoundException('Prompt not found');
    }
    const prompt = await this.service.updateOne(crudReq, dto);
    const promptDto = this.mapper.map(prompt, Prompt, PromptDto);
    promptDto.isFavorite = some(
      prompt.favoritedBy,
      (u) => u.user.id === user.id,
    );
    return promptDto;
  }

  @Override('deleteOneBase')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Delete Prompt', operationId: 'deletePrompt' })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async delete(
    @Request() req,
    @Param('id') id: string,
    @ParsedRequest() crudReq: CrudRequest,
  ) {
    const user = req.user as User;
    const promptExists = await this.service.findOne({
      where: { id, createdBy: { id: user.id } },
    });
    if (!promptExists) {
      throw new NotFoundException('Prompt not found');
    }
    return this.service.deleteOne(crudReq);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Post(':id/mark-as-favorite')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: 'Mark As Favorite',
    operationId: 'markAsFavorite',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async markAsFavorite(@Request() req, @ParsedRequest() crudReq: CrudRequest) {
    const user = req.user;
    const prompt = await this.service.getOne(crudReq);
    return this.service.markAsFavorite(user, prompt);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Delete(':id/remove-from-favorite')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: 'Remove From Favorite',
    operationId: 'removeFromFavorite',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'Success', type: SuccessDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async removeFromFavorite(
    @Request() req,
    @ParsedRequest() crudReq: CrudRequest,
  ): Promise<SuccessDto> {
    const user = req.user;
    const prompt = await this.service.getOne(crudReq);
    return { success: await this.service.removeFromFavorite(user, prompt) };
  }
}

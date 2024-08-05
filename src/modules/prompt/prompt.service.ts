import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { SuccessDto } from '@/common/dto/success.dto';

import { User } from '../user/entities/user.entity';
import { FavoritePrompt } from './entities/favorite-prompt.entity';
import { Prompt } from './entities/prompt.entity';

@Injectable()
export class PromptService extends TypeOrmCrudService<Prompt> {
  constructor(
    @InjectRepository(Prompt) public repository: Repository<Prompt>,
    @InjectRepository(FavoritePrompt)
    public favoritePromptRepository: Repository<FavoritePrompt>,
  ) {
    super(repository);
  }

  async markAsFavorite(user: User, prompt: Prompt): Promise<SuccessDto> {
    const favoritePromptExists = await this.favoritePromptRepository.findOne({
      where: { user: { id: user.id }, prompt: { id: prompt.id } },
    });

    if (favoritePromptExists) return { success: true };

    try {
      await this.favoritePromptRepository.save({ user, prompt });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || '' };
    }
  }

  async removeFromFavorite(user: User, prompt: Prompt) {
    const result = await this.favoritePromptRepository.delete({
      user: { id: user.id },
      prompt: { id: prompt.id },
    });

    return result.affected > 0;
  }
}

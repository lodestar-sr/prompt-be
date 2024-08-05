import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { FavoritePrompt } from './entities/favorite-prompt.entity';
import { Prompt } from './entities/prompt.entity';
import { PromptController } from './prompt.controller';
import { PromptProfile } from './prompt.profile';
import { PromptService } from './prompt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt, FavoritePrompt]), UserModule],
  providers: [PromptProfile, PromptService],
  controllers: [PromptController],
})
export class PromptModule {}

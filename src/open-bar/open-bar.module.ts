import { Module } from '@nestjs/common';
import { OpenBarController } from './open-bar.controller';
import { OpenBarService } from './open-bar.service';

@Module({
  controllers: [OpenBarController],
  providers: [OpenBarService],
})
export class OpenBarModule {}
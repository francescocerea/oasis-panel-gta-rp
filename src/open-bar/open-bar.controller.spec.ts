import { Test, TestingModule } from '@nestjs/testing';
import { OpenBarController } from './open-bar.controller';

describe('OpenBarController', () => {
  let controller: OpenBarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenBarController],
    }).compile();

    controller = module.get<OpenBarController>(OpenBarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { OpenBarService } from './open-bar.service';

describe('OpenBarService', () => {
  let service: OpenBarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenBarService],
    }).compile();

    service = module.get<OpenBarService>(OpenBarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

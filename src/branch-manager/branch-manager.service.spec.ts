import { Test, TestingModule } from '@nestjs/testing';
import { BranchManagerService } from './branch-manager.service';

describe('BranchManagerService', () => {
  let service: BranchManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchManagerService],
    }).compile();

    service = module.get<BranchManagerService>(BranchManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

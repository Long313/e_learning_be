import { Test, TestingModule } from '@nestjs/testing';
import { BranchManagerController } from './branch-manager.controller';
import { BranchManagerService } from './branch-manager.service';

describe('BranchManagerController', () => {
  let controller: BranchManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchManagerController],
      providers: [BranchManagerService],
    }).compile();

    controller = module.get<BranchManagerController>(BranchManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

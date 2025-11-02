import { Module } from '@nestjs/common';
import { BranchManagerService } from './branch-manager.service';
import { BranchManagerController } from './branch-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchManager } from './entities/branch-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BranchManager])],
  controllers: [BranchManagerController],
  providers: [BranchManagerService],
})
export class BranchManagerModule {}

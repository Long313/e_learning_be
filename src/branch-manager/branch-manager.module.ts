import { Module } from '@nestjs/common';
import { BranchManagerService } from './branch-manager.service';
import { BranchManagerController } from './branch-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchManager } from './entities/branch-manager.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BranchManager, User])],
  controllers: [BranchManagerController],
  providers: [BranchManagerService],
})
export class BranchManagerModule {}

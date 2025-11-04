import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Admin]),  
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateParentDto } from './dto/create-parent.dto';
import { Parent } from './entities/parent.entity';

@Injectable()
export class ParentService {
    constructor() {}

    async create(createParentDto: CreateParentDto, manager: EntityManager) {
        const parent = manager.create(Parent, createParentDto);
        await manager.save(parent);
        return parent;
    }
}
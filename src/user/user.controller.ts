import { Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiTags('User Management')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
        this.userService = userService;
    }

    @Post()
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ResponseMessage('User created successfully')
    createUser(@Body() body: CreateUserDto) {
        const hashedPassword = this.userService.hashPassword(body.password);
        body.password = hashedPassword as unknown as string;
        return this.userService.createUser(body);
    }

    @Get('/:type')
    @ApiOperation({ summary: 'Get all users by type' })
    @ApiResponse({ status: 200, description: 'List of users by type' })
    @ResponseMessage('Users retrieved successfully')
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
    getAllUsersByType(@Param('type') type: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.userService.getAllUsersByType(type, page, limit);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update user information' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
    @ResponseMessage('User updated successfully')
    updateUserInfo(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return this.userService.updateUserInfo(id, body);
    }
}

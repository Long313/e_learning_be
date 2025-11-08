import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export abstract class BaseUserResponseDto {
    @ApiProperty({
        description: 'User unique identifier',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @Expose()
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
    })
    @Expose()
    fullName: string;

    @ApiProperty({
        description: 'User gender',
        example: 'male',
    })
    @Expose()
    gender: string;

    @ApiProperty({
        description: 'User birth date',
        example: '1990-01-01T00:00:00.000Z',
    })
    @Type(() => Date)
    @Expose()
    dateOfBirth: Date;

    @ApiProperty({
        description: 'User phone number',
        example: '123-456-7890',
    })
    @Expose()
    phoneNumber: string;

    @ApiProperty({
        description: 'User address',
        example: '123 Main St, Anytown, USA',
    })
    @Expose()
    address?: string;

    @ApiProperty({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
    })
    @Expose()
    avatarUrl?: string;

    @ApiProperty({
        description: 'User status',
        example: 'active',
    })
    @Expose()
    status: string;

    @ApiProperty({
        description: 'User roles',
        example: ['student'],
        type: [String],
    })
    @Expose()
    roles: string[];

    @ApiProperty({
        description: 'User age',
        example: 34,
    })
    @Expose()
    age: number;

    @ApiProperty({
        description: 'Account creation date',
        example: '2023-01-01T12:00:00.000Z',
    })
    @Type(() => Date)
    @Expose()
    createdAt: Date;

    @ApiProperty({
        description: 'Account last update date',
        example: '2023-06-01T12:00:00.000Z',
    })
    @Type(() => Date)
    @Expose()
    updatedAt: Date;
}
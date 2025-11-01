import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export abstract class BaseUserResponseDto {
    @ApiProperty({
        description: 'User unique identifier',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.id)
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.email)
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.fullName)
    fullName: string;

    @ApiProperty({
        description: 'User gender',
        example: 'male',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.gender)
    gender: string;

    @ApiProperty({
        description: 'User birth date',
        example: '1990-01-01T00:00:00.000Z',
    })
    @Type(() => Date)
    @Expose()
    @Transform(({ obj }) => obj.user?.dayOfBirth)
    dayOfBirth: Date;

    @ApiProperty({
        description: 'User phone number',
        example: '123-456-7890',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.phoneNumber)
    phoneNumber: string;

    @ApiProperty({
        description: 'User address',
        example: '123 Main St, Anytown, USA',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.address)
    address?: string;

    @ApiProperty({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.avatarUrl)
    avatarUrl?: string;

    @ApiProperty({
        description: 'User status',
        example: 'active',
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.status)
    status: string;

    @ApiProperty({
        description: 'User roles',
        example: ['student'],
        type: [String],
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.getRoles?.() || [], { toClassOnly: true })
    roles: string[];

    @ApiProperty({
        description: 'User age',
        example: 34,
    })
    @Expose()
    @Transform(({ obj }) => obj.user?.getAge?.() || null, { toClassOnly: true })
    age: number;

    @ApiProperty({
        description: 'Account creation date',
        example: '2023-01-01T12:00:00.000Z',
    })
    @Type(() => Date)
    @Expose()
    @Transform(({ obj }) => obj.user?.createdAt)
    createdAt: Date;

    @ApiProperty({
        description: 'Account last update date',
        example: '2023-06-01T12:00:00.000Z',
    })
    @Type(() => Date)
    @Expose()
    @Transform(({ obj }) => obj.user?.updatedAt)
    updatedAt: Date;
}
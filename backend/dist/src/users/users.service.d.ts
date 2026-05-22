import { Knex } from 'knex';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateUserDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
}

import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateApplicationDto, RespondApplicationDto, UpdateApplicationDto } from './dto/application.dto';
export declare class ApplicationsService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateApplicationDto, requester: JwtPayload): Promise<any>;
    findAll(requester: JwtPayload): Promise<any[]>;
    update(id: number, dto: UpdateApplicationDto, requester: JwtPayload): Promise<any>;
    respond(id: number, dto: RespondApplicationDto, requester: JwtPayload): Promise<any>;
}

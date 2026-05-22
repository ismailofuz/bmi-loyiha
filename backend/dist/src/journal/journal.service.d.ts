import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal.dto';
export declare class JournalService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateJournalEntryDto, requester: JwtPayload): Promise<any>;
    findAll(studentId: number, requester: JwtPayload): Promise<any[]>;
    findOne(id: number, requester: JwtPayload): Promise<any>;
    update(id: number, dto: UpdateJournalEntryDto, requester: JwtPayload): Promise<any>;
    private assertReadAccess;
}

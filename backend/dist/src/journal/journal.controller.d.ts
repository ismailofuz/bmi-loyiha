import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal.dto';
import { JournalService } from './journal.service';
export declare class JournalController {
    private readonly journalService;
    constructor(journalService: JournalService);
    create(dto: CreateJournalEntryDto, user: JwtPayload): Promise<any>;
    findAll(studentId: string, user: JwtPayload): Promise<any[]>;
    findOne(id: string, user: JwtPayload): Promise<any>;
    update(id: string, dto: UpdateJournalEntryDto, user: JwtPayload): Promise<any>;
}

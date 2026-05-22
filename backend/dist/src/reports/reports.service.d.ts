import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateReportDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto';
export declare class ReportsService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateReportDto, requester: JwtPayload): Promise<any>;
    findAll(studentId: number, requester: JwtPayload): Promise<any[]>;
    findOne(id: number, requester: JwtPayload): Promise<any>;
    update(id: number, dto: UpdateReportDto, requester: JwtPayload): Promise<any>;
    review(id: number, dto: ReviewReportDto, requester: JwtPayload): Promise<any>;
    private assertReadAccess;
}

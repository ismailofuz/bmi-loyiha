import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateReportDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(dto: CreateReportDto, user: JwtPayload): Promise<any>;
    findAll(studentId: string, user: JwtPayload): Promise<any[]>;
    findOne(id: string, user: JwtPayload): Promise<any>;
    update(id: string, dto: UpdateReportDto, user: JwtPayload): Promise<any>;
    review(id: string, dto: ReviewReportDto, user: JwtPayload): Promise<any>;
}

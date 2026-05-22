import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateCompanyDto, EnrollMentorDto, UpdateCompanyDto, UpdateMentorDto } from './dto/company.dto';
import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(dto: CreateCompanyDto): Promise<any>;
    enrollMentor(dto: EnrollMentorDto, user: JwtPayload): Promise<any>;
    findMentors(id: string, user: JwtPayload): Promise<any[]>;
    findAll(user: JwtPayload): Promise<any[]>;
    findOne(id: string, user: JwtPayload): Promise<any>;
    updateMentor(id: string, dto: UpdateMentorDto, user: JwtPayload): Promise<any>;
    update(id: string, dto: UpdateCompanyDto, user: JwtPayload): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}

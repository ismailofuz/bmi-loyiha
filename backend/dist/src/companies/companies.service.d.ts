import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateCompanyDto, EnrollMentorDto, UpdateCompanyDto, UpdateMentorDto } from './dto/company.dto';
export declare class CompaniesService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateCompanyDto): Promise<any>;
    findAll(requester: JwtPayload): Promise<any[]>;
    findOne(id: number, requester: JwtPayload): Promise<any>;
    update(id: number, dto: UpdateCompanyDto, requester: JwtPayload): Promise<any>;
    enrollMentor(dto: EnrollMentorDto, requester: JwtPayload): Promise<any>;
    findMentors(companyId: number, requester: JwtPayload): Promise<any[]>;
    updateMentor(mentorId: number, dto: UpdateMentorDto, requester: JwtPayload): Promise<any>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    private assertAccess;
}

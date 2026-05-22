import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { InternshipsService } from './internships.service';
import { AddStudentDto, CreateInternshipDto, RespondInternshipDto, RespondStudentDto, UpdateInternshipDto } from './dto/internship.dto';
export declare class InternshipsController {
    private readonly internshipsService;
    constructor(internshipsService: InternshipsService);
    create(dto: CreateInternshipDto, user: JwtPayload): Promise<any>;
    findAll(user: JwtPayload): Promise<any[]>;
    findOne(id: string, user: JwtPayload): Promise<any>;
    update(id: string, dto: UpdateInternshipDto, user: JwtPayload): Promise<any>;
    cancel(id: string, user: JwtPayload): Promise<any>;
    respond(id: string, dto: RespondInternshipDto, user: JwtPayload): Promise<any>;
    addStudent(id: string, dto: AddStudentDto, user: JwtPayload): Promise<any>;
    findStudents(id: string, user: JwtPayload): Promise<any[]>;
    findAllStudents(user: JwtPayload): Promise<any[]>;
    cancelStudent(id: string, user: JwtPayload): Promise<any>;
    respondStudent(id: string, dto: RespondStudentDto, user: JwtPayload): Promise<any>;
}

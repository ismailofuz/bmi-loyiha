import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AddStudentDto, CreateInternshipDto, RespondInternshipDto, RespondStudentDto, UpdateInternshipDto } from './dto/internship.dto';
export declare class InternshipsService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateInternshipDto, requester: JwtPayload): Promise<any>;
    findAll(requester: JwtPayload): Promise<any[]>;
    findOne(id: number, requester: JwtPayload): Promise<any>;
    update(id: number, dto: UpdateInternshipDto, requester: JwtPayload): Promise<any>;
    cancel(id: number, requester: JwtPayload): Promise<any>;
    respond(id: number, dto: RespondInternshipDto, requester: JwtPayload): Promise<any>;
    addStudent(internshipId: number, dto: AddStudentDto, requester: JwtPayload): Promise<any>;
    findStudents(internshipId: number, requester: JwtPayload): Promise<any[]>;
    findAllStudents(requester: JwtPayload): Promise<any[]>;
    cancelStudent(id: number, requester: JwtPayload): Promise<any>;
    respondStudent(id: number, dto: RespondStudentDto, requester: JwtPayload): Promise<any>;
    private assertInternshipAccess;
}

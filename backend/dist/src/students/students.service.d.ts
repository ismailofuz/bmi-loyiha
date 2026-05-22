import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateStudentDto, EnrollStudentDto, UpdateStudentDto } from './dto/student.dto';
export declare class StudentsService {
    private readonly knex;
    constructor(knex: Knex);
    enroll(dto: EnrollStudentDto, requester: JwtPayload): Promise<any>;
    create(dto: CreateStudentDto, requester: JwtPayload): Promise<any>;
    findAll(requester: JwtPayload): Promise<any[]>;
    findOne(id: number, requester: JwtPayload): Promise<any>;
    update(id: number, dto: UpdateStudentDto, requester: JwtPayload): Promise<any>;
    private assertAccess;
}

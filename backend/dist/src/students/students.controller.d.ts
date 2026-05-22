import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateStudentDto, EnrollStudentDto, UpdateStudentDto } from './dto/student.dto';
import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    enroll(dto: EnrollStudentDto, user: JwtPayload): Promise<any>;
    create(dto: CreateStudentDto, user: JwtPayload): Promise<any>;
    findAll(user: JwtPayload): Promise<any[]>;
    findOne(id: string, user: JwtPayload): Promise<any>;
    update(id: string, dto: UpdateStudentDto, user: JwtPayload): Promise<any>;
}

import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateUniversityDto, EnrollStaffDto, UpdateStaffDto, UpdateStaffPermissionsDto, UpdateUniversityDto } from './dto/university.dto';
export declare class UniversitiesService {
    private readonly knex;
    constructor(knex: Knex);
    create(dto: CreateUniversityDto): Promise<any>;
    findAll(requester: JwtPayload): Promise<any[]>;
    findOne(id: number, requester: JwtPayload): Promise<any>;
    update(id: number, dto: UpdateUniversityDto, requester: JwtPayload): Promise<any>;
    enrollStaff(dto: EnrollStaffDto, requester: JwtPayload): Promise<any>;
    findStaff(universityId: number, requester: JwtPayload): Promise<any[]>;
    updateStaff(staffId: number, dto: UpdateStaffDto, requester: JwtPayload): Promise<any>;
    updateStaffPermissions(staffId: number, dto: UpdateStaffPermissionsDto, requester: JwtPayload): Promise<any>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    private assertAccess;
}

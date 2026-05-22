import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateUniversityDto, EnrollStaffDto, UpdateStaffDto, UpdateStaffPermissionsDto, UpdateUniversityDto } from './dto/university.dto';
import { UniversitiesService } from './universities.service';
export declare class UniversitiesController {
    private readonly universitiesService;
    constructor(universitiesService: UniversitiesService);
    create(dto: CreateUniversityDto): Promise<any>;
    enrollStaff(dto: EnrollStaffDto, user: JwtPayload): Promise<any>;
    findStaff(id: string, user: JwtPayload): Promise<any[]>;
    findAll(user: JwtPayload): Promise<any[]>;
    findOne(id: string, user: JwtPayload): Promise<any>;
    updateStaffPermissions(id: string, dto: UpdateStaffPermissionsDto, user: JwtPayload): Promise<any>;
    updateStaff(id: string, dto: UpdateStaffDto, user: JwtPayload): Promise<any>;
    update(id: string, dto: UpdateUniversityDto, user: JwtPayload): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}

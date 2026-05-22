import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AcademicService } from './academic.service';
import { CreateDegreeDto, CreateDepartmentDto, CreateDirectionDto, CreateEducationFormDto, CreateEducationLanguageDto, CreateEducationTypeDto, CreateFacultyDto, CreateGroupDto, CreateCourseDto, UpdateDegreeDto, UpdateDepartmentDto, UpdateDirectionDto, UpdateEducationFormDto, UpdateEducationLanguageDto, UpdateEducationTypeDto, UpdateFacultyDto, UpdateGroupDto, UpdateCourseDto } from './dto/academic.dto';
export declare class AcademicController {
    private readonly academicService;
    constructor(academicService: AcademicService);
    listDegrees(user: JwtPayload): Promise<any[]>;
    createDegree(dto: CreateDegreeDto, user: JwtPayload): Promise<any>;
    updateDegree(id: string, dto: UpdateDegreeDto, user: JwtPayload): Promise<any>;
    deleteDegree(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listFaculties(user: JwtPayload): Promise<any[]>;
    createFaculty(dto: CreateFacultyDto, user: JwtPayload): Promise<any>;
    updateFaculty(id: string, dto: UpdateFacultyDto, user: JwtPayload): Promise<any>;
    deleteFaculty(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listAllDepartments(user: JwtPayload): Promise<any[]>;
    listDepartments(id: string, user: JwtPayload): Promise<any[]>;
    createDepartment(dto: CreateDepartmentDto, user: JwtPayload): Promise<any>;
    updateDepartment(id: string, dto: UpdateDepartmentDto, user: JwtPayload): Promise<any>;
    deleteDepartment(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listEducationForms(user: JwtPayload): Promise<any[]>;
    createEducationForm(dto: CreateEducationFormDto, user: JwtPayload): Promise<any>;
    updateEducationForm(id: string, dto: UpdateEducationFormDto, user: JwtPayload): Promise<any>;
    deleteEducationForm(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listEducationTypes(user: JwtPayload): Promise<any[]>;
    createEducationType(dto: CreateEducationTypeDto, user: JwtPayload): Promise<any>;
    updateEducationType(id: string, dto: UpdateEducationTypeDto, user: JwtPayload): Promise<any>;
    deleteEducationType(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listEducationLanguages(user: JwtPayload): Promise<any[]>;
    createEducationLanguage(dto: CreateEducationLanguageDto, user: JwtPayload): Promise<any>;
    updateEducationLanguage(id: string, dto: UpdateEducationLanguageDto, user: JwtPayload): Promise<any>;
    deleteEducationLanguage(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listAllDirections(user: JwtPayload): Promise<any[]>;
    listDirections(id: string, user: JwtPayload): Promise<any[]>;
    createDirection(dto: CreateDirectionDto, user: JwtPayload): Promise<any>;
    updateDirection(id: string, dto: UpdateDirectionDto, user: JwtPayload): Promise<any>;
    deleteDirection(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listAllCourses(user: JwtPayload): Promise<any[]>;
    listCourses(id: string, user: JwtPayload): Promise<any[]>;
    createCourse(dto: CreateCourseDto, user: JwtPayload): Promise<any>;
    updateCourse(id: string, dto: UpdateCourseDto, user: JwtPayload): Promise<any>;
    deleteCourse(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listAllGroups(user: JwtPayload): Promise<any[]>;
    listGroups(id: string, user: JwtPayload): Promise<any[]>;
    createGroup(dto: CreateGroupDto, user: JwtPayload): Promise<any>;
    updateGroup(id: string, dto: UpdateGroupDto, user: JwtPayload): Promise<any>;
    deleteGroup(id: string, user: JwtPayload): Promise<{
        deleted: boolean;
    }>;
}

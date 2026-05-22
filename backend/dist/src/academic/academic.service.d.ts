import { Knex } from 'knex';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateDegreeDto, CreateDepartmentDto, CreateDirectionDto, CreateEducationFormDto, CreateEducationLanguageDto, CreateEducationTypeDto, CreateFacultyDto, CreateGroupDto, CreateCourseDto, UpdateDegreeDto, UpdateDepartmentDto, UpdateDirectionDto, UpdateEducationFormDto, UpdateEducationLanguageDto, UpdateEducationTypeDto, UpdateFacultyDto, UpdateGroupDto, UpdateCourseDto } from './dto/academic.dto';
export declare class AcademicService {
    private readonly knex;
    constructor(knex: Knex);
    private universityId;
    private assertFacultyAccess;
    private assertDirectionAccess;
    private assertCourseAccess;
    private assertGroupAccess;
    private resolveUniversityId;
    listDegrees(requester: JwtPayload): Promise<any[]>;
    createDegree(dto: CreateDegreeDto, requester: JwtPayload): Promise<any>;
    updateDegree(id: number, dto: UpdateDegreeDto, requester: JwtPayload): Promise<any>;
    deleteDegree(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listFaculties(requester: JwtPayload): Promise<any[]>;
    createFaculty(dto: CreateFacultyDto, requester: JwtPayload): Promise<any>;
    updateFaculty(id: number, dto: UpdateFacultyDto, requester: JwtPayload): Promise<any>;
    deleteFaculty(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listDepartments(facultyId: number, requester: JwtPayload): Promise<any[]>;
    listAllDepartments(requester: JwtPayload): Promise<any[]>;
    createDepartment(dto: CreateDepartmentDto, requester: JwtPayload): Promise<any>;
    updateDepartment(id: number, dto: UpdateDepartmentDto, requester: JwtPayload): Promise<any>;
    deleteDepartment(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listEducationForms(requester: JwtPayload): Promise<any[]>;
    createEducationForm(dto: CreateEducationFormDto, requester: JwtPayload): Promise<any>;
    updateEducationForm(id: number, dto: UpdateEducationFormDto, requester: JwtPayload): Promise<any>;
    deleteEducationForm(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listEducationTypes(requester: JwtPayload): Promise<any[]>;
    createEducationType(dto: CreateEducationTypeDto, requester: JwtPayload): Promise<any>;
    updateEducationType(id: number, dto: UpdateEducationTypeDto, requester: JwtPayload): Promise<any>;
    deleteEducationType(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listEducationLanguages(requester: JwtPayload): Promise<any[]>;
    createEducationLanguage(dto: CreateEducationLanguageDto, requester: JwtPayload): Promise<any>;
    updateEducationLanguage(id: number, dto: UpdateEducationLanguageDto, requester: JwtPayload): Promise<any>;
    deleteEducationLanguage(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listDirections(facultyId: number, requester: JwtPayload): Promise<any[]>;
    listAllDirections(requester: JwtPayload): Promise<any[]>;
    createDirection(dto: CreateDirectionDto, requester: JwtPayload): Promise<any>;
    updateDirection(id: number, dto: UpdateDirectionDto, requester: JwtPayload): Promise<any>;
    deleteDirection(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listCourses(directionId: number, requester: JwtPayload): Promise<any[]>;
    listAllCourses(requester: JwtPayload): Promise<any[]>;
    createCourse(dto: CreateCourseDto, requester: JwtPayload): Promise<any>;
    updateCourse(id: number, dto: UpdateCourseDto, requester: JwtPayload): Promise<any>;
    deleteCourse(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
    listGroups(courseId: number, requester: JwtPayload): Promise<any[]>;
    listAllGroups(requester: JwtPayload): Promise<any[]>;
    createGroup(dto: CreateGroupDto, requester: JwtPayload): Promise<any>;
    updateGroup(id: number, dto: UpdateGroupDto, requester: JwtPayload): Promise<any>;
    deleteGroup(id: number, requester: JwtPayload): Promise<{
        deleted: boolean;
    }>;
}

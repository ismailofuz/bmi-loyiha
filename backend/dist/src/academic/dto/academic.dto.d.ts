export declare class CreateFacultyDto {
    name: string;
    code?: string;
    university_id?: number;
}
export declare class UpdateFacultyDto {
    name?: string;
    code?: string;
}
export declare class CreateDepartmentDto {
    name: string;
    faculty_id: number;
}
export declare class UpdateDepartmentDto {
    name?: string;
}
export declare class CreateDegreeDto {
    name: string;
}
export declare class UpdateDegreeDto {
    name?: string;
}
export declare class CreateEducationFormDto {
    name: string;
}
export declare class UpdateEducationFormDto {
    name?: string;
}
export declare class CreateEducationTypeDto {
    name: string;
}
export declare class UpdateEducationTypeDto {
    name?: string;
}
export declare class CreateEducationLanguageDto {
    name: string;
}
export declare class UpdateEducationLanguageDto {
    name?: string;
}
export declare class CreateDirectionDto {
    name: string;
    code?: string;
    faculty_id: number;
    edu_form_id?: number;
    edu_type_id?: number;
    edu_lang_id?: number;
    degree_id?: number;
}
export declare class UpdateDirectionDto {
    name?: string;
    code?: string;
    edu_form_id?: number;
    edu_type_id?: number;
    edu_lang_id?: number;
    degree_id?: number;
}
export declare class CreateCourseDto {
    direction_id: number;
    number: number;
}
export declare class UpdateCourseDto {
    number?: number;
}
export declare class CreateGroupDto {
    name: string;
    course_id: number;
}
export declare class UpdateGroupDto {
    name?: string;
    course_id?: number;
}

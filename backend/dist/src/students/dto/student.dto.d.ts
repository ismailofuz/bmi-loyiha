export declare class CreateStudentDto {
    email: string;
    password: string;
    university_id: number;
    full_name: string;
    phone?: string;
    faculty_id?: number;
    direction_id?: number;
    course_id?: number;
    group_id?: number;
    edu_form_id?: number;
    edu_type_id?: number;
    edu_lang_id?: number;
}
export declare class EnrollStudentDto {
    email: string;
    password: string;
    full_name: string;
    university_id: number;
    passport_serial?: string;
    pin?: string;
    faculty_id?: number;
    direction_id?: number;
    course_id?: number;
    group_id?: number;
    edu_form_id?: number;
    edu_type_id?: number;
    edu_lang_id?: number;
}
export declare class UpdateStudentDto {
    full_name?: string;
    phone?: string;
    passport_serial?: string;
    pin?: string;
    faculty_id?: number;
    direction_id?: number;
    course_id?: number;
    group_id?: number;
    edu_form_id?: number;
    edu_type_id?: number;
    edu_lang_id?: number;
}

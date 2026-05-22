export declare class CreateInternshipDto {
    company_id: number;
    supervisor_id?: number;
    internship_start: string;
    internship_end: string;
}
export declare class UpdateInternshipDto {
    supervisor_id?: number;
    internship_start?: string;
    internship_end?: string;
}
export declare class RespondInternshipDto {
    status: 'accepted' | 'cancelled';
}
export declare class AddStudentDto {
    student_id: number;
}
export declare class RespondStudentDto {
    status: 'accepted' | 'cancelled';
}

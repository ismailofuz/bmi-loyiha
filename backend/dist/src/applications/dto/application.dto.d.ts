export declare class CreateApplicationDto {
    student_id: number;
    company_id: number;
    supervisor_id?: number;
    internship_start: string;
    internship_end: string;
}
export declare class UpdateApplicationDto {
    company_id?: number;
    supervisor_id?: number;
    internship_start: string;
    internship_end: string;
}
export declare class RespondApplicationDto {
    status: 'accepted' | 'rejected';
}

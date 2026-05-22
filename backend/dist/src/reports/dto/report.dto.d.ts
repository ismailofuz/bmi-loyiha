export declare class CreateReportDto {
    week_number: number;
    content: string;
}
export declare class UpdateReportDto {
    content?: string;
    status?: string;
}
export declare class ReviewReportDto {
    status: string;
    reviewer_feedback?: string;
}

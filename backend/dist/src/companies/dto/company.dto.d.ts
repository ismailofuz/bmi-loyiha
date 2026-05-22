export declare class CreateCompanyDto {
    name: string;
    industry?: string;
    address?: string;
    contact_email?: string;
    admin_email: string;
    admin_password: string;
    admin_name?: string;
}
export declare class EnrollMentorDto {
    email: string;
    password: string;
    company_id: number;
    full_name?: string;
    phone?: string;
}
export declare class UpdateMentorDto {
    full_name?: string;
    phone?: string;
    email?: string;
    new_password?: string;
}
export declare class UpdateCompanyDto {
    name?: string;
    industry?: string;
    address?: string;
    contact_email?: string;
}

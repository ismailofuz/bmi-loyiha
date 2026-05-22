export declare class CreateUniversityDto {
    name: string;
    address?: string;
    contact_email?: string;
    admin_email: string;
    admin_password: string;
    admin_name?: string;
}
export declare class EnrollStaffDto {
    email: string;
    password: string;
    university_id: number;
    full_name?: string;
    phone?: string;
    is_admin?: boolean;
}
export declare class UpdateUniversityDto {
    name?: string;
    address?: string;
    contact_email?: string;
}
export declare class UpdateStaffDto {
    full_name?: string;
    phone?: string;
    email?: string;
    new_password?: string;
}
export declare class UpdateStaffPermissionsDto {
    permissions?: Record<string, Record<string, boolean>>;
    is_admin?: boolean;
}

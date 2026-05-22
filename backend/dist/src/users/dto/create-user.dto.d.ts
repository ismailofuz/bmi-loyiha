import { Role } from '../../common/enums/role.enum';
export declare class CreateUserDto {
    email: string;
    password: string;
    role: Role;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    is_active?: boolean;
}

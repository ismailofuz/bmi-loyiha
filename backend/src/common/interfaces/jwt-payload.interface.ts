import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  /** Populated for university_staff — their university id */
  universityId?: number;
  /** Populated for university_staff — whether they are an admin */
  isAdmin?: boolean;
  /** Populated for company_mentor — their company id */
  companyId?: number;
  /** Populated for student — same as sub but explicit for frontend convenience */
  studentId?: number;
}

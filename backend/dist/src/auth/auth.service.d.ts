import { JwtService } from '@nestjs/jwt';
import { Knex } from 'knex';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly knex;
    private readonly jwtService;
    constructor(knex: Knex, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: any;
    }>;
    private loginSuperAdmin;
    private buildPayloadFromRecord;
}

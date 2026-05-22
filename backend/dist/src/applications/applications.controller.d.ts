import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CreateApplicationDto, RespondApplicationDto, UpdateApplicationDto } from './dto/application.dto';
import { ApplicationsService } from './applications.service';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(dto: CreateApplicationDto, user: JwtPayload): Promise<any>;
    findAll(user: JwtPayload): Promise<any[]>;
    update(id: string, dto: UpdateApplicationDto, user: JwtPayload): Promise<any>;
    respond(id: string, dto: RespondApplicationDto, user: JwtPayload): Promise<any>;
}

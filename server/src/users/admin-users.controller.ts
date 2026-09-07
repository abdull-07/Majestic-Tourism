import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
    constructor(private usersService: UsersService) { }

    // Viewing users: any admin-panel role can see this
    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
    @Get()
    findAll(@Query('role') role?: string) {
        return this.usersService.findAll(role);
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    // Role promotion: Super Admin ONLY — confirmed decision, do not widen this
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id/role')
    updateRole(
        @Param('id') id: string,
        @Body() dto: UpdateUserRoleDto,
        @CurrentUser('id') requestingUserId: string,
    ) {
        return this.usersService.updateRole(id, dto, requestingUserId);
    }

    // Activate/deactivate: Admin and Super Admin, not Staff
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateUserStatusDto,
        @CurrentUser('id') requestingUserId: string,
    ) {
        return this.usersService.updateStatus(id, dto, requestingUserId);
    }
}
import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminSettingsController {
    constructor(private settingsService: SettingsService) { }

    @Get()
    findAll() {
        return this.settingsService.findAll();
    }

    // PUT, not POST/PATCH — this is an upsert: creates the key if new, updates if it exists
    @Put(':key')
    upsert(@Param('key') key: string, @Body() dto: UpsertSettingDto) {
        return this.settingsService.upsert(key, dto);
    }

    @Delete(':key')
    remove(@Param('key') key: string) {
        return this.settingsService.remove(key);
    }
}
import {
    Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/destinations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class AdminDestinationsController {
    constructor(private destinationsService: DestinationsService) { }

    @Get()
    findAll() {
        return this.destinationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.destinationsService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateDestinationDto) {
        return this.destinationsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDestinationDto) {
        return this.destinationsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.destinationsService.remove(id);
    }
}
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
    constructor(private toursService: ToursService) { }

    @Get()
    findAllActive(
        @Query('destinationId') destinationId?: string,
        @Query('category') category?: string,
    ) {
        return this.toursService.findAllActive({ destinationId, category });
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.toursService.findBySlug(slug);
    }
}
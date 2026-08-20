import { Controller, Get, Param } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
    constructor(private destinationsService: DestinationsService) { }

    @Get()
    findAllActive() {
        return this.destinationsService.findAllActive();
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.destinationsService.findBySlug(slug);
    }
}
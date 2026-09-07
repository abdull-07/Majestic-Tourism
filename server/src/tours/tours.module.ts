import { Module } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { AdminToursController } from './admin-tours.controller';
import { ToursService } from './tours.service';

@Module({
    controllers: [ToursController, AdminToursController],
    providers: [ToursService],
})
export class ToursModule { }
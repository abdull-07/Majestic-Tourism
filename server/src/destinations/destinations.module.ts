import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { AdminDestinationsController } from './admin-destinations.controller';
import { DestinationsService } from './destinations.service';

@Module({
    controllers: [DestinationsController, AdminDestinationsController],
    providers: [DestinationsService],
})
export class DestinationsModule { }
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { ToursModule } from './tours/tours.module';
import { BookingsModule } from './bookings/bookings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DestinationsModule,
    ToursModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    WishlistModule,
    CouponsModule,
    UsersModule,
    MediaModule,
    DashboardModule,
    SettingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

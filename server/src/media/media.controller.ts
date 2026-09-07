import {
    Controller, Post, Delete, Param, UseGuards, UseInterceptors, UploadedFile,
    BadRequestException, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder: string = 'general',
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded — send it as multipart/form-data field "file"');
        }
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new BadRequestException('File must be under 5MB');
        }

        const result = await this.mediaService.uploadImage(file, folder);
        return { url: result.secure_url, publicId: result.public_id };
    }

    @Delete(':publicId')
    async remove(@Param('publicId') publicId: string) {
        // publicId may contain slashes (folder paths) — client must URL-encode it
        await this.mediaService.deleteImage(decodeURIComponent(publicId));
        return { message: 'Image deleted' };
    }
}
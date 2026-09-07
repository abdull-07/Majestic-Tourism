import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as CloudinaryType } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
    constructor(@Inject(CLOUDINARY) private cloudinary: typeof CloudinaryType) { }

    async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                { folder: `majestic-tourism/${folder}` },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Cloudinary returned no result'));
                    resolve(result);
                },
            );
            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        await this.cloudinary.uploader.destroy(publicId);
    }
}
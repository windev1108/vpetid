// src/cloudinary/cloudinary.service.ts
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'node:stream';
import { CLOUDINARY } from './cloudinary.provider';

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
}

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject(CLOUDINARY) private readonly cloudinary: typeof v2,
    ) { }

    /**
     * Upload buffer (từ multer memoryStorage) lên Cloudinary bằng upload_stream -
     * không ghi file tạm ra disk, phù hợp môi trường serverless/container ephemeral fs.
     */
    async uploadImage(
        buffer: Buffer,
        options: { folder: string; publicId?: string },
    ): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                {
                    folder: options.folder,
                    public_id: options.publicId,
                    resource_type: 'image',
                    // Giới hạn kích thước hiển thị tối đa, tránh lưu ảnh gốc quá to
                    // rồi FE phải tự resize khi render — Cloudinary xử lý luôn lúc upload.
                    transformation: [
                        { width: 1024, height: 1024, crop: 'limit' },
                        { quality: 'auto', fetch_format: 'auto' },
                    ],
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error || !result) {
                        reject(
                            new InternalServerErrorException(
                                'Failed to upload image to Cloudinary.',
                            ),
                        );
                        return;
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            );

            Readable.from(buffer).pipe(uploadStream);
        });
    }

   async deleteImage(publicId: string): Promise<void> {
    const result = await this.cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
    });

    console.log('Cloudinary destroy:', {
        publicId,
        result,
    });

    if (result.result !== 'ok') {
        console.warn('Cloudinary image was not deleted:', result);
    }
}
}
// src/cloudinary/cloudinary.provider.ts
import { Provider } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
    provide: CLOUDINARY,
    useFactory: () => {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            // Fail fast lúc khởi động app thay vì lỗi mơ hồ lúc user thực sự upload,
            // giống pattern GoogleService đã dùng cho OAuth env vars.
            throw new Error(
                'Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET',
            );
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });

        return cloudinary;
    },
};
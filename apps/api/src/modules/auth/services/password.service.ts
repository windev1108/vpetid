import { Injectable, OnModuleInit } from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordService implements OnModuleInit {
    // Hash "rác" tạo sẵn lúc khởi động, dùng khi email không tồn tại hoặc
    // user chưa có mật khẩu (vd: user tạo qua Google). Nhờ đó thời gian phản hồi
    // của /auth/login luôn phải chạy qua argon2.verify, không lộ việc email
    // có tồn tại trong hệ thống hay không qua timing.
    private dummyHash = '';

    async onModuleInit() {
        this.dummyHash = await this.hash(randomBytes(32).toString('hex'));
    }

    async hash(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 1,
        });
    }

    async verify(passwordHash: string, password: string): Promise<boolean> {
        return argon2.verify(passwordHash, password);
    }

    async verifyDummy(password: string): Promise<boolean> {
        if (!this.dummyHash) {
            this.dummyHash = await this.hash(randomBytes(32).toString('hex'));
        }
        return argon2.verify(this.dummyHash, password);
    }
}
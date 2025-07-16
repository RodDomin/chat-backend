import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { PasswordHashProvider } from "./password-hash.provider";

@Injectable()
export class BCryptPasswordHashProvider implements PasswordHashProvider {
    constructor(
        private readonly salts: number,
    ) {}

    compare(passwordA: string, passwordB: string): Promise<boolean> {
        return bcrypt.compare(passwordA, passwordB);
    }

    hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.salts);
    }
}
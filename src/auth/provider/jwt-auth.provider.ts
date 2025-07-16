import { JwtService } from "@nestjs/jwt";
import { AuthProvider } from "./auth.provider";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuthProvider<T extends object> implements AuthProvider<T> {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    createToken(data: T) {
        return this.jwtService.sign(data);
    }

    createRefreshToken(data: T) {
        return this.jwtService.sign(data, { expiresIn: '7d' });
    }

    async validateToken(token: string) {
        try {
            const data = await this.jwtService.verify(token);

            return data;
        } catch {
            return undefined;
        }
    }
}

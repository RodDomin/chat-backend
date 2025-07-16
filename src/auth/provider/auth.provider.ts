export interface AuthProvider<T> {
    createToken(data: T): string;
    createRefreshToken(data: T): string;
    validateToken(token: string): Promise<T>;
}

export const AUTH_PROVIDER = 'AUTH_PROVIDER';

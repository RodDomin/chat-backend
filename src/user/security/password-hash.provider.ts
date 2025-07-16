export interface PasswordHashProvider {
    compare(passwordA: string, passwordB: string): Promise<boolean>
    hash(password: string): Promise<string>;
};

export const PASSWORD_HASH_PROVIDER = 'PASSWORD_HASH_PROVIDER';

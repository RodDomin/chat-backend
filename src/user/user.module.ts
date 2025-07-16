import { Module, HttpException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountValidation, User } from './entities'
import { UserResolver } from './resolvers/user.resolver'
import { UserFilter } from './exceptions/UserFilter.exception';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from './user.service';
import { BCryptPasswordHashProvider } from './security/bcrypt-password-hash.provider';
import { PASSWORD_HASH_PROVIDER } from './security/password-hash.provider';

@Module({
	imports: [
		HttpException,
		TypeOrmModule.forFeature([
			User,
			AccountValidation,
		]),
		AuthModule
	],
	exports: [
		UserService
	],
	providers: [
		UserService,
		UserResolver,
		UserFilter,
		{
			provide: PASSWORD_HASH_PROVIDER,
			useFactory: () => new BCryptPasswordHashProvider(8),

		}
	]
})
export class UserModule {}
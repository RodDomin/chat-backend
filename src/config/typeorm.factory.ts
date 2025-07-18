import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmFactory implements TypeOrmOptionsFactory {
    constructor(
        private readonly configService: ConfigService
    ) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get('DATABASE_HOST'),
            port: this.configService.get('DATABASE_PORT'),
            username: this.configService.get('DATABASE_USER'),
            database: this.configService.get('DATABASE_PASSWORD'),
            autoLoadEntities: true,
            synchronize: true,
        }
    }
}
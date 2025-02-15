import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PgConfig } from '../../shared/types';
import { EnvironmentEnum } from '../../shared/enums';

@Injectable()
export class AppConfigService {
	constructor(private readonly configService: ConfigService) {}

	get appPort(): number {
		return this.configService.getOrThrow<number>('APP_PORT');
	}

	get appEnv(): EnvironmentEnum {
		return this.configService.getOrThrow<EnvironmentEnum>('APP_ENV');
	}

	get jwtAccessSecret(): string {
		return this.configService.getOrThrow<string>('JWT_SECRET');
	}

	get pgConfig(): PgConfig {
		return {
			port: this.configService.getOrThrow<number>('POSTGRES_PORT'),
			host: this.configService.getOrThrow<string>('POSTGRES_HOST'),
			username: this.configService.getOrThrow<string>('POSTGRES_USER'),
			password: this.configService.getOrThrow<string>('POSTGRES_PASSWORD'),
			database: this.configService.getOrThrow<string>('POSTGRES_DB'),
		};
	}
}

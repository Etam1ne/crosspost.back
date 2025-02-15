import { Module } from '@nestjs/common';
import { AppConfigModule } from './infra/ioc';
import { AppConfigService } from './infra/config';
import { JwtModule } from '@nestjs/jwt';
import { PostgresModule } from './infra/ioc/postgres.module';
import { HttpControllers } from './api/http';
import { CommandHandlers, QueryHandlers } from './core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entities } from './infra/postgres/entities';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy, LocalAuthStrategy } from './api/http/strategies';

@Module({
	imports: [
		CqrsModule,
		AppConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			useFactory: (configService: AppConfigService) => ({
				secret: configService.jwtAccessSecret,
			}),
			inject: [AppConfigService],
			global: true,
		}),
		TypeOrmModule.forFeature([...Entities]),
		PostgresModule,
	],
	controllers: [...HttpControllers],
	providers: [
		JwtAuthStrategy,
		LocalAuthStrategy,
		...CommandHandlers,
		...QueryHandlers,
	],
})
export class AppModule {}

import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'node:path';
import { PgConfig } from '../../shared/types';

const getDataSourceOptions = (): DataSourceOptions => {
	dotenv.config();

	const pgConfig: PgConfig = {
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
	};

	return {
		type: 'postgres',
		...pgConfig,

		entities: [join(__dirname, '..', 'postgres', 'entities', '*.entity.js')],
		migrations: [
			join(__dirname, '..', 'postgres', 'migrations', '*-migration*.js'),
		],

		synchronize: false,
		namingStrategy: new SnakeNamingStrategy(),
	};
};

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			...getDataSourceOptions(),
		};
	}
}

export default new DataSource(getDataSourceOptions());

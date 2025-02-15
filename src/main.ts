import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './infra/config';
import { TransformInterceptor } from './shared/interceptors';

async function bootstrap() {
	const logger = new Logger('MAIN');
	const GLOBAL_PREFIX = 'api';

	const app = await NestFactory.create(AppModule);

	app
		.setGlobalPrefix(GLOBAL_PREFIX)
		.useGlobalInterceptors(new TransformInterceptor())
		.useGlobalPipes(new ValidationPipe({ transform: true }));

	const configService = app.get(AppConfigService);

	await app.listen(configService.appPort, () => {
		logger.log(`App successfully started on port ${configService.appPort}`);
	});
}
bootstrap();

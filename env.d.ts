declare namespace NodeJS {
	interface ProcessEnv {
		APP_PORT: number;
		APP_ENV: string;

		POSTGRES_HOST: string;
		POSTGRES_PORT: number;
		POSTGRES_USER: string;
		POSTGRES_PASSWORD: string;
		POSTGRES_DB: string;

		JWT_SECRET: string;
	}
}

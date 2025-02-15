import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser, HttpCustomResponse } from '../decorators';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../../shared/dtos/users/login.dto';
import { RegisterDto } from '../../../shared/dtos/users/register.dto';
import { RegisterCommand } from '../../../core/users/commands/register.command';
import { LoginCommand } from '../../../core/users/commands/login.command';
import { UserEntity } from '../../../infra/postgres/entities';
import { GetMeQuery } from '../../../core/users/queries/get-me.query';
import { TokenPayload } from '../../../shared/types';
import { JwtAuthGuard } from '../guards';

@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@HttpCustomResponse({ type: UserEntity })
	public async getMe(@CurrentUser() user: TokenPayload): Promise<string> {
		const data = await this.queryBus.execute<GetMeQuery, string>(
			new GetMeQuery(user),
		);
		return data;
	}

	@Post('login')
	@HttpCustomResponse({ type: String })
	public async login(@Body() dto: LoginDto): Promise<string> {
		const data = await this.commandBus.execute<LoginCommand, string>(
			new LoginCommand(dto),
		);

		return data;
	}

	@Post('register')
	@HttpCustomResponse({ type: String })
	public async register(@Body() dto: RegisterDto): Promise<string> {
		const data = await this.commandBus.execute<RegisterCommand, string>(
			new RegisterCommand(dto),
		);
		return data;
	}
}

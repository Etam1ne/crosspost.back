import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../../../shared/dtos/users/login.dto';
import { UserEntity } from '../../../infra/postgres/entities';
import { HashLib } from '../../../shared/libs';

export class LoginCommand {
	constructor(public readonly dto: LoginDto) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async execute({ dto }: LoginCommand): Promise<string> {
		const user = await this.userRepository.findOne({
			where: { login: dto.login },
			select: ['password', 'id'],
		});

		if (!user) {
			throw new UnauthorizedException('User does not exist');
		}

		const isValid = await HashLib.verify(dto.password, user.password);

		if (!isValid) {
			throw new UnauthorizedException('Incorrect password');
		}

		return this.jwtService.signAsync({ userId: user.id });
	}
}

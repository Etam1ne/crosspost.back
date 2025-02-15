import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../../../shared/dtos/users/register.dto';
import { UserEntity } from '../../../infra/postgres/entities';
import { HashLib } from '../../../shared/libs';

export class RegisterCommand {
	constructor(public readonly dto: RegisterDto) {}
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async execute({ dto }: RegisterCommand): Promise<string> {
		const existingUser = await this.userRepository.findOne({
			where: { login: dto.login },
		});

		if (existingUser) {
			throw new ConflictException('User already exists');
		}

		const hashedPassword = await HashLib.hash(dto.password);

		const userEntity = this.userRepository.create({
			...dto,
			password: hashedPassword,
		});

		const newUser = await this.userRepository.save(userEntity);

		return this.jwtService.signAsync({ userId: newUser.id });
	}
}

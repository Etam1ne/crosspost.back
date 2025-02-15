import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../infra/postgres/entities';
import { TokenPayload } from '../../../shared/types';
import { HashLib } from '../../../shared/libs';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {
		super({ usernameField: 'login', passwordField: 'password' });
	}

	async validate(login: string, password: string): Promise<TokenPayload> {
		const user = await this.userRepository.findOne({
			where: { login },
			select: { id: true },
		});

		if (!user || !(await HashLib.verify(password, user.password))) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return {
			userId: user.id,
		};
	}
}

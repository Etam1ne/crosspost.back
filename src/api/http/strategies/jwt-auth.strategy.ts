import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { TokenPayload } from '../../../shared/types/token-payload.type';
import { UserEntity } from '../../../infra/postgres/entities';
import { AppConfigService } from '../../../infra/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly configService: AppConfigService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromHeader('x-access-token'),
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.jwtAccessSecret,
		});
	}

	async validate(payload: TokenPayload): Promise<TokenPayload> {
		const user = await this.userRepository.findOne({
			where: { id: payload.userId },
			select: { id: true },
		});

		if (!user) {
			throw new UnauthorizedException('User from token does not exist');
		}

		return {
			userId: user.id,
		};
	}
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../infra/postgres/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from '../../../shared/types';
import { NotFoundException } from '@nestjs/common';

export class GetMeQuery {
	constructor(public readonly dto: TokenPayload) {}
}

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	public async execute(query: GetMeQuery): Promise<UserEntity> {
		const user = this.userRepository.findOneBy({ id: query.dto.userId });

		if (!user) {
			throw new NotFoundException('user not found');
		}

		return user;
	}
}

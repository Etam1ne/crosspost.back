import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from '../../../shared/types';

@Entity({ name: 'users' })
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: UUID;

	@Column({
		type: 'varchar',
		length: 63,
	})
	login: string;

	@Column({
		type: 'varchar',
		length: 255,
		select: false,
	})
	password: string;
}

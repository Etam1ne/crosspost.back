import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

import { ResponseStatusEnum } from '../../enums';
import { IPaginationOutputDto, PaginationOutputDto } from './pagination.dto';

export interface IUniversalResponseDto<T = null> {
	status: ResponseStatusEnum;
	data: T;
	error: string | null;
}

export interface IPaginatedResponseDto<T = null>
	extends IUniversalResponseDto<T> {
	meta: IPaginationOutputDto;
}

export interface IPaginatedDto<T = null> extends IUniversalResponseDto<T> {
	meta: IPaginationOutputDto;
}

export class UniversalResponseDto<T = null>
	implements IUniversalResponseDto<T>
{
	constructor(options?: IUniversalResponseDto<T>) {
		this.error = options?.error;
		this.status = options?.status;
		this.data = options?.data;
	}

	@IsString()
	error: string | null = null;

	@IsEnum(ResponseStatusEnum)
	status: ResponseStatusEnum = ResponseStatusEnum.ok;

	@IsNotEmpty()
	data: T;
}

export class PaginatedResponseDto<T = null> extends UniversalResponseDto<T> {
	@IsObject()
	@IsNotEmpty()
	meta: PaginationOutputDto;

	constructor(options?: IPaginatedDto<T>) {
		super(options);
		this.meta = new PaginationOutputDto(
			options?.meta.total,
			options?.meta.limit,
			options?.meta.page,
		);
	}
}

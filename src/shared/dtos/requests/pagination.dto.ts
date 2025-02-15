import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export interface IUniversalPaginationDto {
	page: number;
	limit: number;
	skip?: number;
}

export interface IPaginationOutputDto {
	limit: number;
	page: number;
	total: number;
}

export class UniversalPaginationDto implements IUniversalPaginationDto {
	@IsOptional()
	@Min(1)
	@IsInt()
	@Type(() => Number)
	@ApiPropertyOptional()
	page = 1;

	@IsOptional()
	@Min(1)
	@Max(500)
	@IsInt()
	@Type(() => Number)
	@ApiPropertyOptional()
	limit = 15;

	get skip(): number {
		return (this.page - 1) * this.limit;
	}
}

export class PaginationOutputDto implements IPaginationOutputDto {
	constructor(total: number, limit: number, page: number) {
		this.total = total;
		this.limit = limit;
		this.page = page;
	}
	@IsNumber()
	total: number;

	@IsNumber()
	limit: number;

	@IsNumber()
	page: number;
}

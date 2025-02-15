import {
	IPaginatedResponseDto,
	IPaginationOutputDto,
	IUniversalResponseDto,
	PaginatedResponseDto,
	UniversalResponseDto,
} from '../dtos/requests';
import { ResponseStatusEnum } from '../enums';

export class UniversalResponseTransformer {
	static transform<T>(
		data: T | [T, IPaginationOutputDto],
	): IUniversalResponseDto<T> | IPaginatedResponseDto<T> {
		if (Array.isArray(data) && Array.isArray(data[0])) {
			return new PaginatedResponseDto<T>({
				status: ResponseStatusEnum.ok,
				error: null,
				data: data[0],
				meta: data[1],
			});
		}
		return new UniversalResponseDto<T>({
			status: ResponseStatusEnum.ok,
			error: null,
			data: data as T,
		});
	}
}

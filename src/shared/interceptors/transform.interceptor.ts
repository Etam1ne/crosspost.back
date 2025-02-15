import type {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPaginatedResponseDto, IUniversalResponseDto } from '../dtos/requests';
import { UniversalResponseTransformer } from '../helpers';

export interface Response<T> {
	data: T;
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		return next
			.handle()
			.pipe(
				map((data): IUniversalResponseDto<T> | IPaginatedResponseDto<T> =>
					UniversalResponseTransformer.transform(data),
				),
			);
	}
}

import type { Type } from '@nestjs/common';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiQuery,
	ApiResponse,
	getSchemaPath,
} from '@nestjs/swagger';
import type {
	ReferenceObject,
	SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
	PaginatedResponseDto,
	UniversalPaginationDto,
	UniversalResponseDto,
} from '../../../shared/dtos/requests';

export const HttpCustomResponse = <Model extends Type<unknown>>(input: {
	type: Model | [Model];
	statusCode?: HttpStatus;
	withMeta?: boolean;
}) => {
	let model: Model;
	const { type: tModel, statusCode = HttpStatus.OK } = input;
	const allOf: (SchemaObject | ReferenceObject)[] = [
		{ $ref: getSchemaPath(UniversalResponseDto) },
	];

	const decorators: Parameters<typeof applyDecorators>[0][] = [];
	let data: Record<string, unknown> = {};

	if (tModel) {
		if (Array.isArray(tModel)) {
			model = tModel[0];
			data = {
				type: 'array',
				items: {
					$ref: getSchemaPath(model),
				},
			};
			if (input.withMeta) {
				allOf.push({ $ref: getSchemaPath(PaginatedResponseDto) });
				decorators.push(ApiQuery({ type: () => UniversalPaginationDto }));
				decorators.push(ApiExtraModels(PaginatedResponseDto, model));
			} else {
				decorators.push(ApiExtraModels(UniversalResponseDto, model));
			}
		} else {
			model = tModel;
			const type = model.name.toLowerCase();
			data.type = type;

			if (!['string', 'number', 'object', 'boolean'].includes(type)) {
				data.type = undefined;
				data.$ref = getSchemaPath(model);
			}

			decorators.push(ApiExtraModels(UniversalResponseDto, model));
		}
	}

	allOf.push({
		properties: {
			data,
		},
	});

	decorators.push(
		ApiResponse(
			{ status: statusCode, schema: { allOf } },
			{ overrideExisting: false },
		),
	);

	return applyDecorators(...decorators);
};

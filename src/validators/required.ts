import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type RequiredValidatorConfig = ValidatorConfigWithMessage;

const DEFAULT_CONFIG = { message: 'This field is mandatory' };

export function required<ValueType>(
	{ message }: RequiredValidatorConfig = DEFAULT_CONFIG
): FieldValidator<ValueType> {
	return makeValidator( {
		predicate: value => !!value,
		message
	} );
}

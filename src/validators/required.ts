import config from '../config';
import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type RequiredValidatorConfig = ValidatorConfigWithMessage;

export function required<ValueType>(
	{ message }: RequiredValidatorConfig = config.validators.required
): FieldValidator<ValueType> {
	return makeValidator( {
		predicate: value => !!value,
		message
	} );
}

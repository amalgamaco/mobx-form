import config from '../config';
import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type MaxLengthValidatorConfig = ValidatorConfigWithMessage;

export function maxLength(
	maxLengthValue: number,
	{ message }: MaxLengthValidatorConfig = config.validators.maxLength
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => value.length <= maxLengthValue,
		message: message.replace( ':length', maxLengthValue.toString() )
	} );
}

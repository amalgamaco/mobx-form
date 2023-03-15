import config from '../config';
import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type MinLengthValidatorConfig = ValidatorConfigWithMessage;

export function minLength(
	minLengthValue: number,
	{ message }: MinLengthValidatorConfig = config.validators.minLength
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => value.length >= minLengthValue,
		message: message.replace( ':length', minLengthValue.toString() )
	} );
}

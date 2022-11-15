import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type MinLengthValidatorConfig = ValidatorConfigWithMessage;

const DEFAULT_CONFIG = {
	message: 'Must have at least :length characters'
};

export function minLength(
	minLengthValue: number,
	{ message }: MinLengthValidatorConfig = DEFAULT_CONFIG
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => value.length >= minLengthValue,
		message: message.replace( ':length', minLengthValue.toString() )
	} );
}

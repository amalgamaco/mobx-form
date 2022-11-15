import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type MaxLengthValidatorConfig = ValidatorConfigWithMessage;

const DEFAULT_CONFIG = {
	message: 'Must have at most :length characters'
};

export function maxLength(
	maxLengthValue: number,
	{ message }: MaxLengthValidatorConfig = DEFAULT_CONFIG
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => value.length <= maxLengthValue,
		message: message.replace( ':length', maxLengthValue.toString() )
	} );
}

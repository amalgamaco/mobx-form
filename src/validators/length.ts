import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type LengthValidatorConfig = ValidatorConfigWithMessage;

const DEFAULT_CONFIG = {
	message: 'Must have exactly :length characters'
};

export function length(
	lengthValue: number,
	{ message }: LengthValidatorConfig = DEFAULT_CONFIG
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => value.length === lengthValue,
		message: message.replace( ':length', lengthValue.toString() )
	} );
}

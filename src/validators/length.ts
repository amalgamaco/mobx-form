import config from '../config';
import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type LengthValidatorConfig = ValidatorConfigWithMessage;

export function length(
	lengthValue: number,
	{ message }: LengthValidatorConfig = config.validators.length
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => value.length === lengthValue,
		message: message.replace( ':length', lengthValue.toString() )
	} );
}

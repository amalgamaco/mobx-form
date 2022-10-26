import isEmail from 'validator/lib/isEmail';
import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type EmailValidatorConfig = ValidatorConfigWithMessage;

const DEFAULT_CONFIG = { message: 'This email does not have a valid format' };

export function email(
	{ message }: EmailValidatorConfig = DEFAULT_CONFIG
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => isEmail( value ),
		message
	} );
}

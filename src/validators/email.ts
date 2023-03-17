import isEmail from 'validator/lib/isEmail';
import config from '../config';
import type { FieldValidator, ValidatorConfigWithMessage } from './types';
import { makeValidator } from './utils';

export type EmailValidatorConfig = ValidatorConfigWithMessage;

export function email(
	{ message }: EmailValidatorConfig = config.validators.email
): FieldValidator<string> {
	return makeValidator( {
		predicate: value => isEmail( value ),
		message
	} );
}

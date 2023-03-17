import type { InputErrorDisplayConfig } from '../Input';
import type { DeepPartial } from '../utils/types';
import type { EmailValidatorConfig } from '../validators/email';
import type { LengthValidatorConfig } from '../validators/length';
import type { MaxLengthValidatorConfig } from '../validators/maxLength';
import type { MinLengthValidatorConfig } from '../validators/minLength';
import type { RequiredValidatorConfig } from '../validators/required';

export interface Config {
	inputs: {
		showErrors: InputErrorDisplayConfig
	},
	validators: {
		email: EmailValidatorConfig,
		length: LengthValidatorConfig,
		maxLength: MaxLengthValidatorConfig,
		minLength: MinLengthValidatorConfig,
		required: RequiredValidatorConfig
	}
}

export type ConfigOptions = DeepPartial<Config>;

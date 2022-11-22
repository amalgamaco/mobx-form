import type { InputParams } from '../Input';

export interface TextInputParams extends Omit<InputParams<string>, 'defaultValue'> {
	defaultValue?: string
}

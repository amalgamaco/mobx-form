import type { FieldParams } from '../Field';

export type InputErrorDisplayConfig = 'onWrite' | 'onBlur' | 'onSubmit';

export interface InputParams<ValueType> extends FieldParams<ValueType> {
	placeholder?: string,
	showErrors?: InputErrorDisplayConfig
}

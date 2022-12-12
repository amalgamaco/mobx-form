import type { FieldValidator } from '../../validators';

export interface FieldStateParams<ValueType> {
	label?: string,
	defaultValue: ValueType,
	value?: ValueType,
	validators?: FieldValidator<ValueType>[],
	disabled?: boolean
}

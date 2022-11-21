import type { FieldValidator } from '../../validators';

export interface FieldStateParams<ValueType> {
	label?: string,
	value: ValueType,
	validators?: FieldValidator<ValueType>[],
	disabled?: boolean
}

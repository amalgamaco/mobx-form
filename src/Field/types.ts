import type { FieldValidator } from '../validators';

export interface FieldParams<ValueType> {
	label?: string,
	hint?: string,
	value: ValueType,
	validators?: FieldValidator<ValueType>[],
	disabled?: boolean
}

export type AnnotatedPrivateFieldProps = '_value' | '_error' | '_parentForm' | 'failedValidationResult';

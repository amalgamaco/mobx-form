import type Form from '../Form';

export interface ValidationResult {
	isValid: boolean,
	error: string
}

export type FieldValidator<ValueType> = (
	value: ValueType, form?: Form, label?: string
) => ValidationResult;

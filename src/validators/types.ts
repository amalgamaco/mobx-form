import type Form from '../Form';

export interface ValidationResult {
	isValid: boolean,
	error: string
}

export type FieldValidator<ValueType> = (
	value: ValueType, form?: Form, label?: string
) => ValidationResult;

export interface MakeValidatorParams<ValueType> {
	predicate: ( value: ValueType, form?: Form ) => boolean,
	message: string
}

export interface ValidatorConfigWithMessage {
	message: string
}

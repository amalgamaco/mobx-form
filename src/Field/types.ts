import type Form from '../Form';

export type FieldValidator<ValueType> = ( value: ValueType, form?: Form, key?: string ) => string;

export interface FieldParams<ValueType> {
	label?: string,
	hint?: string,
	value: ValueType,
	validators?: FieldValidator<ValueType>[],
	disabled?: boolean
}

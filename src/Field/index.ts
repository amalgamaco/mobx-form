import { makeAutoObservable } from 'mobx';
import type { FieldParams, FieldValidator } from './types';
import type Form from '../Form';

const fieldAlreadyAttachedError = ( label: string ) => new Error(
	`Tried to re-attach a field with label "${label}". Fields can only be attached to a Form instance once.`
);

export default class Field<ValueType> {
	readonly label: string;
	readonly hint: string;
	readonly isDisabled: boolean;

	private _value: ValueType;
	private _initialValue: ValueType;
	private _validators: FieldValidator<ValueType>[];

	private _parentForm?: Form;

	constructor( {
		label = '',
		hint = '',
		value,
		validators = [],
		disabled = false
	}: FieldParams<ValueType> ) {
		this.label = label;
		this.hint = hint;
		this.isDisabled = disabled;

		this._value = value;
		this._initialValue = value;
		this._validators = validators;

		makeAutoObservable( this );
	}

	get value() {
		return this._value;
	}

	get isValid() {
		return this._validators.every( validator => this.acceptsValue( validator ) );
	}

	get isDirty() {
		return this._value !== this._initialValue;
	}

	change( newValue: ValueType ) {
		this._value = newValue;
	}

	reset() {
		this._value = this._initialValue;
	}

	attachToForm( form: Form ) {
		if ( this._parentForm ) throw fieldAlreadyAttachedError( this.label );

		this._parentForm = form;
	}

	private acceptsValue( validator: FieldValidator<ValueType> ) {
		return validator( this._value, this._parentForm, this.label ) === '';
	}
}

export type { FieldParams } from './types';
export type ValueType<F> = F extends Field<infer V> ? V : never;
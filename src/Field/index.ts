import { makeAutoObservable } from 'mobx';
import type { FieldParams, FieldValidator } from './types';

export default class Field<ValueType> {
	readonly label: string;
	readonly hint: string;
	readonly isDisabled: boolean;

	private _value: ValueType;
	private _initialValue: ValueType;
	private _validators: FieldValidator<ValueType>[];

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

	private acceptsValue( validator: FieldValidator<ValueType> ) {
		return validator( this._value ) === '';
	}
}

export type { FieldParams } from './types';

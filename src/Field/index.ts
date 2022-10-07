import { makeAutoObservable } from 'mobx';
import type { FieldParams } from './types';

export default class Field<ValueType> {
	readonly label: string;
	readonly hint: string;
	readonly isDisabled: boolean;

	private _value: ValueType;
	private _initialValue: ValueType;

	constructor( {
		label = '',
		hint = '',
		value,
		disabled = false
	}: FieldParams<ValueType> ) {
		this.label = label;
		this.hint = hint;
		this.isDisabled = disabled;

		this._value = value;
		this._initialValue = value;

		makeAutoObservable( this );
	}

	get value() {
		return this._value;
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
}

export type { FieldParams } from './types';

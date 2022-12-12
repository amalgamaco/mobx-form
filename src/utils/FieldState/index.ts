import { makeAutoObservable } from 'mobx';
import type { FieldStateParams } from './types';
import type Form from '../../Form';
import type { FieldValidator } from '../../validators';

const fieldAlreadyAttachedError = ( label: string ) => new Error(
	`Tried to re-attach a field with label "${label}". Fields can only be attached to a Form instance once.`
);

export default class FieldState<ValueType> {
	readonly label: string;
	readonly isDisabled: boolean;

	private readonly _defaultValue: ValueType;
	private _value: ValueType;
	private readonly _initialValue: ValueType;
	private readonly _validators: FieldValidator<ValueType>[];
	private _parentForm?: Form;

	constructor( {
		label = '',
		defaultValue,
		value = defaultValue,
		validators = [],
		disabled = false
	}: FieldStateParams<ValueType> ) {
		this.label = label;
		this.isDisabled = disabled;

		this._defaultValue = defaultValue;
		this._value = value;
		this._initialValue = value;
		this._validators = validators;

		makeAutoObservable( this );
	}

	get value() {
		return this._value;
	}

	get isValid() {
		return !this.failedValidationResult;
	}

	get isDirty() {
		return this._value !== this._initialValue;
	}

	get error() {
		return this.failedValidationResult?.error;
	}

	setValue( newValue: ValueType ) {
		this._value = newValue;
	}

	clear() {
		this._value = this._defaultValue;
	}

	reset() {
		this._value = this._initialValue;
	}

	attachToForm( form: Form ) {
		if ( this._parentForm ) throw fieldAlreadyAttachedError( this.label );

		this._parentForm = form;
	}

	private get failedValidationResult() {
		return this.validationResults.find( result => !result.isValid );
	}

	private get validationResults() {
		return this._validators.map(
			validator => validator( this._value, this._parentForm, this.label )
		);
	}
}

export type { FieldStateParams };

import {
	action, computed, makeObservable, observable
} from 'mobx';
import type { AnnotatedPrivateFieldProps, FieldParams } from './types';
import type Form from '../Form';
import type { FieldValidator } from '../validators';

const fieldAlreadyAttachedError = ( label: string ) => new Error(
	`Tried to re-attach a field with label "${label}". Fields can only be attached to a Form instance once.`
);

export default abstract class Field<ValueType> {
	readonly label: string;
	readonly hint: string;
	readonly isDisabled: boolean;

	protected _value: ValueType;
	protected readonly _initialValue: ValueType;
	protected readonly _validators: FieldValidator<ValueType>[];
	protected _error: string;

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
		this._error = '';

		makeObservable<Field<ValueType>, AnnotatedPrivateFieldProps>( this, {
			value: computed,
			isValid: computed,
			isDirty: computed,
			error: computed,
			reset: action,
			syncError: action,
			attachToForm: action,
			_value: observable,
			_error: observable,
			_parentForm: observable,
			failedValidationResult: computed
		} );
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
		return this._error;
	}

	reset() {
		this._value = this._initialValue;
	}

	syncError() {
		this._error = this.failedValidationResult?.error || '';
	}

	showError( errorMessage: string ) {
		this._error = errorMessage;
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

export type { FieldParams };
export type ValueType<F> = F extends Field<infer V> ? V : never;

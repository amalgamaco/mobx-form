import { makeAutoObservable, reaction } from 'mobx';
import type { FieldStateParams, FieldOnChangeCallback } from './types';
import type Form from '../../Form';
import type { FieldValidator } from '../../validators';

const fieldAlreadyAttachedError = ( label: string ) => new Error(
	`Tried to re-attach a field with label "${label}". Fields can only be attached to a Form instance once.`
);

export default class FieldState<ValueType> {
	readonly label: string;

	private readonly _defaultValue: ValueType;
	private readonly _initialValue: ValueType;
	private readonly _validators: FieldValidator<ValueType>[];
	private readonly _onChange?: FieldOnChangeCallback<ValueType>;

	private _value: ValueType;
	private _isDisabled: boolean;
	private _parentForm?: Form;

	constructor( {
		label = '',
		defaultValue,
		value = defaultValue,
		validators = [],
		disabled = false,
		onChange = undefined
	}: FieldStateParams<ValueType> ) {
		this.label = label;

		this._defaultValue = defaultValue;
		this._initialValue = value;
		this._validators = validators;
		this._onChange = onChange;

		this._value = value;
		this._isDisabled = disabled;

		makeAutoObservable( this );

		this.setUpOnChangeReaction();
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

	get isDisabled() {
		return this._isDisabled;
	}

	get error() {
		return this.failedValidationResult?.error;
	}

	get parentForm() {
		return this._parentForm;
	}

	setValue( newValue: ValueType ) {
		this._value = newValue;
	}

	setIsDisabled( isDisabled: boolean ) {
		this._isDisabled = isDisabled;
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

	private setUpOnChangeReaction() {
		reaction(
			() => this._value,
			( newValue: ValueType ) => this._onChange?.( newValue, this._parentForm )
		);
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

export type { FieldStateParams, FieldOnChangeCallback };

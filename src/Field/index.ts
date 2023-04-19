import {
	action, computed, makeObservable, observable
} from 'mobx';
import FieldState from '../utils/FieldState';
import type { AnnotatedPrivateFieldProps, FieldParams } from './types';
import type Form from '../Form';

export default abstract class Field<ValueType> {
	readonly hint: string;

	protected _state: FieldState<ValueType>;
	protected _presentedError: string;

	constructor( {
		hint = '',
		...fieldStateParams
	}: FieldParams<ValueType> ) {
		this.hint = hint;

		this._state = new FieldState( fieldStateParams );
		this._presentedError = '';

		makeObservable<Field<ValueType>, AnnotatedPrivateFieldProps>( this, {
			_state: observable,
			_presentedError: observable,
			label: computed,
			value: computed,
			isValid: computed,
			isDirty: computed,
			error: computed,
			isDisabled: computed,
			setIsDisabled: action,
			clear: action,
			reset: action,
			syncError: action,
			showError: action,
			clearError: action,
			attachToForm: action
		} );
	}

	get label() {
		return this._state.label;
	}

	get value() {
		return this._state.value;
	}

	get isValid() {
		return this._state.isValid;
	}

	get isDirty() {
		return this._state.isDirty;
	}

	get error() {
		return this._presentedError;
	}

	get isDisabled() {
		return this._state.isDisabled;
	}

	setIsDisabled( isDisabled: boolean ) {
		this._state.setIsDisabled( isDisabled );
	}

	clear() {
		this._state.clear();
		this.hideError();
	}

	reset() {
		this._state.reset();
		this.hideError();
	}

	syncError() {
		this._presentedError = this._state.error || '';
	}

	showError( errorMessage: string ) {
		this._presentedError = errorMessage;
	}

	clearError() {
		this.showError( '' );
	}

	attachToForm( form: Form ) {
		this._state.attachToForm( form );
	}

	protected hideError() {
		this._presentedError = '';
	}

	protected setValue( newValue: ValueType ) {
		this._state.setValue( newValue );
	}
}

export type { FieldParams };
export type { FieldOnChangeCallback } from '../utils/FieldState';

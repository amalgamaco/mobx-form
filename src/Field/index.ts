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
			reset: action,
			syncError: action,
			showError: action,
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

	reset() {
		this._state.reset();
		this._presentedError = '';
	}

	syncError() {
		this._presentedError = this._state.error || '';
	}

	showError( errorMessage: string ) {
		this._presentedError = errorMessage;
	}

	attachToForm( form: Form ) {
		this._state.attachToForm( form );
	}

	protected setValue( newValue: ValueType ) {
		this._state.setValue( newValue );
	}
}

export type { FieldParams };
export type ValueType<F> = F extends Field<infer V> ? V : never;

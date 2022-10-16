import {
	action, computed, makeObservable, observable
} from 'mobx';
import Field from '../Field';
import type { InputErrorDisplayConfig, InputParams } from './types';

export default class Input<ValueType> extends Field<ValueType> {
	readonly placeholder: string;
	protected readonly showErrors: InputErrorDisplayConfig;
	protected _isFocused: boolean;

	constructor( {
		placeholder = '',
		showErrors = 'onBlur',
		...fieldParams
	}: InputParams<ValueType> ) {
		super( fieldParams );

		this.placeholder = placeholder;
		this.showErrors = showErrors;
		this._isFocused = false;

		makeObservable<Input<ValueType>, '_isFocused'>( this, {
			_isFocused: observable,
			isFocused: computed,
			focus: action,
			write: action,
			blur: action
		} );
	}

	get isFocused() {
		return this._isFocused;
	}

	focus() {
		this._isFocused = true;
	}

	write( newValue: ValueType ) {
		this.focus();
		this._value = newValue;
		if ( this.isValid || this.showErrors === 'onWrite' ) this.syncError();
	}

	blur() {
		this._isFocused = false;
		if ( this.showErrors === 'onBlur' ) this.syncError();
	}
}

export type { InputParams };

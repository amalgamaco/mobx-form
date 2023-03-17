import {
	action, computed, makeObservable, observable, reaction
} from 'mobx';
import config from '../config';
import Field from '../Field';
import type { InputCallback, InputErrorDisplayConfig, InputParams } from './types';

export default class Input<ValueType> extends Field<ValueType> {
	readonly placeholder: string;

	protected readonly showErrors: InputErrorDisplayConfig;
	protected readonly onFocus?: InputCallback;
	protected readonly onBlur?: InputCallback;

	protected _isFocused: boolean;

	constructor( {
		placeholder = '',
		showErrors = config.inputs.showErrors,
		onFocus = undefined,
		onBlur = undefined,
		...fieldParams
	}: InputParams<ValueType> ) {
		super( fieldParams );

		this.placeholder = placeholder;

		this.showErrors = showErrors;
		this.onFocus = onFocus;
		this.onBlur = onBlur;

		this._isFocused = false;

		makeObservable<Input<ValueType>, '_isFocused'>( this, {
			_isFocused: observable,
			isFocused: computed,
			focus: action,
			write: action,
			blur: action
		} );

		this.setUpFocusReaction();
	}

	get isFocused() {
		return this._isFocused;
	}

	focus() {
		this._isFocused = true;
	}

	write( newValue: ValueType ) {
		this.focus();
		this.setValue( newValue );
		if ( this.isValid || this.showErrors === 'onWrite' ) this.syncError();
	}

	blur() {
		this._isFocused = false;
		if ( this.showErrors === 'onBlur' ) this.syncError();
	}

	protected setUpFocusReaction() {
		reaction(
			() => this.isFocused,
			( isFocused ) => {
				const callback = isFocused ? this.onFocus : this.onBlur;
				callback?.( this.parentForm );
			}
		);
	}

	protected get parentForm() {
		return this._state.parentForm;
	}
}

export type { InputCallback, InputErrorDisplayConfig, InputParams };

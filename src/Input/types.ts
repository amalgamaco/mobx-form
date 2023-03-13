import type { FieldParams } from '../Field';
import type Form from '../Form';

export type InputErrorDisplayConfig = 'onWrite' | 'onBlur' | 'onSubmit';

export type InputCallback = ( form?: Form ) => void;

export interface InputParams<ValueType> extends FieldParams<ValueType> {
	placeholder?: string,
	showErrors?: InputErrorDisplayConfig,
	onFocus?: InputCallback,
	onBlur?: InputCallback
}

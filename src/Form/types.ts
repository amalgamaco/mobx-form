import type Field from '../Field';
import type Form from '.';

export type FormFields<ValueTypes, KeyTypes extends PropertyKey = PropertyKey>
	= Record<KeyTypes, Field<ValueTypes>>;

export type FormValues<F, K extends keyof F> = Record<K, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormSubmitCallback<T extends FormFields<any>>
	= ( form: Form<T> ) => void | Promise<void>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormSubmitAction<T extends FormFields<any>>
	= ( form: Form<T> ) => Promise<unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormParams<T extends FormFields<any, keyof T>> {
	fields: T,
	onSubmit?: FormSubmitCallback<T>
}

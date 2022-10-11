import Field from '../Field';
import type Form from '.';

export type FormSubmitCallback = ( form: Form ) => Promise<void>;

export interface FormParams {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fields: Record<string, Field<any>>,
	onSubmit: FormSubmitCallback
}

export type FormFields = Record<string, Field<unknown>>;

export type FormValues = Record<string, unknown>;

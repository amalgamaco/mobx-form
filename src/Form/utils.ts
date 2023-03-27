import { mapValues } from 'lodash';
import type Form from '.';
import { FormFields, FormSubmitAction, FormSubmitCallback } from './types';

export function wrapInAsyncAction( onSubmit: FormSubmitCallback ) {
	return (
		( form: Form ) => Promise.resolve( onSubmit( form ) )
	) as FormSubmitAction;
}

export function valuesOf( fields: FormFields ) {
	return mapValues( fields, field => field.value );
}

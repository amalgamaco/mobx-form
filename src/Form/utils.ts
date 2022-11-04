import { AsyncAction } from '@amalgama/mobx-async-action';
import { mapValues } from 'lodash';
import type Form from '.';
import { FormFields, FormSubmitAction, FormSubmitCallback } from './types';

export function wrapInAsyncAction( onSubmit: FormSubmitCallback ) {
	return new AsyncAction<FormSubmitAction>(
		( form: Form ) => Promise.resolve( onSubmit( form ) )
	);
}

export function valuesOf( fields: FormFields ) {
	return mapValues( fields, field => field.value );
}

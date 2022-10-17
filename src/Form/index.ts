import { makeAutoObservable } from 'mobx';
import { forEach, pickBy, some } from 'lodash';
import { AsyncAction } from '@amalgama/mobx-async-action';
import Field from '../Field';
import type {
	FormFields, FormParams, FormSubmitCallback, FormValues
} from './types';
import { valuesOf } from './utils';

export default class Form {
	private fields: FormFields;
	private onSubmit: AsyncAction<FormSubmitCallback>;

	constructor( { fields, onSubmit }: FormParams ) {
		this.fields = fields;
		this.onSubmit = new AsyncAction<FormSubmitCallback>( onSubmit );

		makeAutoObservable( this );
	}

	get values(): FormValues {
		return valuesOf( this.fields );
	}

	get dirtyValues(): FormValues {
		return valuesOf( this.dirtyFields );
	}

	get isDirty() {
		return some( this.fields, field => field.isDirty );
	}

	get isReadyToSubmit() {
		return this.isDirty && !this.isSubmitting;
	}

	get isSubmitting() {
		return this.onSubmit.isExecuting;
	}

	select<FieldType extends Field<unknown>>( fieldKey: string ) {
		return this.fields[ fieldKey ] as FieldType;
	}

	submit() {
		if ( this.isSubmitting ) return Promise.resolve();

		return this.onSubmit.execute( this );
	}

	reset() {
		forEach( this.fields, field => field.reset() );
	}

	private get dirtyFields(): FormFields {
		return pickBy( this.fields, field => field.isDirty );
	}
}

export type { FormParams, FormValues } from './types';

import { makeAutoObservable } from 'mobx';
import {
	every, forEach, pickBy, some
} from 'lodash';
import type { AsyncAction } from '@amalgama/mobx-async-action';
import Field, { type ValueType } from '../Field';
import type {
	FormFields, FormParams, FormSubmitAction, FormValues
} from './types';
import { valuesOf, wrapInAsyncAction } from './utils';

export default class Form {
	private fields: FormFields;
	private submitAction: AsyncAction<FormSubmitAction>;

	constructor( { fields, onSubmit }: FormParams ) {
		this.fields = fields;
		this.submitAction = wrapInAsyncAction( onSubmit );

		this.attachFields();

		makeAutoObservable( this );
	}

	get values(): FormValues {
		return valuesOf( this.fields );
	}

	get dirtyValues(): FormValues {
		return valuesOf( this.dirtyFields );
	}

	get isValid() {
		return every( this.enabledFields, field => field.isValid );
	}

	get isDirty() {
		return some( this.fields, field => field.isDirty );
	}

	get isReadyToSubmit() {
		return this.isValid && this.isDirty && !this.isSubmitting;
	}

	get isSubmitting() {
		return this.submitAction.isExecuting;
	}

	select<FieldType extends Field<ValueType<FieldType>> = Field<unknown>>( fieldKey: string ) {
		return this.fields[ fieldKey ] as FieldType;
	}

	async submit() {
		this.syncFieldErrors();
		if ( !this.isValid || this.isSubmitting ) return;

		await this.submitAction.execute( this );
	}

	reset() {
		forEach( this.fields, field => field.reset() );
	}

	showErrors( errors: Record<string, string> ) {
		forEach( errors, ( error, fieldKey ) => this.showErrorOnField( fieldKey, error ) );
	}

	private attachFields() {
		forEach( this.fields, field => field.attachToForm( this ) );
	}

	private get dirtyFields() {
		return this.pickFieldsBy( field => field.isDirty );
	}

	private get enabledFields() {
		return this.pickFieldsBy( field => !field.isDisabled );
	}

	private pickFieldsBy( predicate: ( field: Field<unknown> ) => boolean ): FormFields {
		return pickBy( this.fields, predicate );
	}

	private syncFieldErrors() {
		forEach( this.fields, field => field.syncError() );
	}

	private showErrorOnField( fieldKey: string, error: string ) {
		this.fields[ fieldKey ]?.showError( error );
	}
}

export type { FormParams, FormValues } from './types';

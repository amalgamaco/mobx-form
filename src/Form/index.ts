import {
	action, computed, makeObservable, observable
} from 'mobx';
import {
	every, forEach, pickBy, some
} from 'lodash';
import Field from '../Field';
import type {
	FormFields, FormParams, FormSubmitAction, FormValues
} from './types';
import { valuesOf, wrapInAsyncAction } from './utils';
import type { ValueType } from '../utils/types';
import deprecatedMethod from '../utils/deprecatedMethod';

export default class Form {
	private fields: FormFields;
	private submitAction: FormSubmitAction;
	private _isSubmitting: boolean;

	constructor( { fields, onSubmit = () => undefined }: FormParams ) {
		this.fields = fields;
		this.submitAction = wrapInAsyncAction( onSubmit );
		this._isSubmitting = false;

		this.attachFields();

		makeObservable<Form, 'fields' | 'submitAction'>( this, {
			fields: observable,
			submitAction: observable,
			values: computed,
			dirtyValues: computed,
			isValid: computed,
			isDirty: computed,
			isReadyToSubmit: computed,
			isSubmitting: computed,
			submit: action,
			clear: action,
			reset: action,
			showErrors: action
		} );
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
		return this._isSubmitting;
	}

	field<FieldType extends Field<ValueType<FieldType>> = Field<unknown>>( fieldKey: string ) {
		return this.fields[ fieldKey ] as FieldType;
	}

	select<FieldType extends Field<ValueType<FieldType>> = Field<unknown>>( fieldKey: string ) {
		deprecatedMethod(
			'Form', 'select', { alternative: 'field', docsPath: '/reference/Form.md#field' }
		);

		return this.field<FieldType>( fieldKey );
	}

	async submit() {
		this.syncFieldErrors();
		if ( !this.isValid || this.isSubmitting ) return;

		await this.executeSubmitAction();
	}

	clear() {
		this.eachField( field => field.clear() );
	}

	reset() {
		this.eachField( field => field.reset() );
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

	private executeSubmitAction() {
		this._isSubmitting = true;

		return this.submitAction( this )
			.finally( action( () => { this._isSubmitting = false; } ) );
	}

	private eachField( actionOnField: ( field: Field<unknown> ) => void ) {
		forEach( this.fields, actionOnField );
	}

	private showErrorOnField( fieldKey: string, error: string ) {
		this.fields[ fieldKey ]?.showError( error );
	}
}

export type { FormParams, FormValues };

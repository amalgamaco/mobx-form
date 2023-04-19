import {
	action, computed, makeObservable, observable
} from 'mobx';
import {
	clone, every, forEach, pickBy, some
} from 'lodash';
import Field from '../Field';
import type {
	FormFields, FormParams, FormSubmitAction, FormValues
} from './types';
import { valuesOf, wrapInAsyncAction } from './utils';
import type { ValueType } from '../utils/types';
import deprecatedMethod from '../utils/deprecatedMethod';

export default class Form {
	private _fields: FormFields;
	private submitAction: FormSubmitAction;
	private _isSubmitting: boolean;

	constructor( { fields, onSubmit = () => undefined }: FormParams ) {
		this._fields = fields;
		this.submitAction = wrapInAsyncAction( onSubmit );
		this._isSubmitting = false;

		this.attachFields();

		makeObservable<Form, '_fields' | 'submitAction' | '_isSubmitting' >( this, {
			_fields: observable,
			submitAction: observable,
			_isSubmitting: observable,
			fields: computed,
			values: computed,
			dirtyValues: computed,
			isValid: computed,
			isDirty: computed,
			isReadyToSubmit: computed,
			isSubmitting: computed,
			submit: action,
			clear: action,
			reset: action,
			showErrors: action,
			clearErrors: action
		} );
	}

	get fields(): FormFields {
		return clone( this._fields );
	}

	get values(): FormValues {
		return valuesOf( this._fields );
	}

	get dirtyValues(): FormValues {
		return valuesOf( this.dirtyFields );
	}

	get isValid() {
		return every( this.enabledFields, field => field.isValid );
	}

	get isDirty() {
		return some( this._fields, field => field.isDirty );
	}

	get isReadyToSubmit() {
		return this.isValid && this.isDirty && !this.isSubmitting;
	}

	get isSubmitting() {
		return this._isSubmitting;
	}

	field<FieldType extends Field<ValueType<FieldType>> = Field<unknown>>( fieldKey: string ) {
		return this._fields[ fieldKey ] as FieldType;
	}

	select<FieldType extends Field<ValueType<FieldType>> = Field<unknown>>( fieldKey: string ) {
		deprecatedMethod(
			'Form', 'select', { alternative: 'field', docsPath: '/reference/Form.md#field' }
		);

		return this.field<FieldType>( fieldKey );
	}

	eachField( actionOnField: ( field: Field<unknown> ) => void ) {
		forEach( this._fields, actionOnField );
	}

	submit(): Promise<void> {
		this.syncFieldErrors();
		if ( !this.isValid || this.isSubmitting ) return Promise.resolve();

		return this.executeSubmitAction();
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

	clearErrors() {
		this.eachField( field => field.clearError() );
	}

	private attachFields() {
		forEach( this._fields, field => field.attachToForm( this ) );
	}

	private get dirtyFields() {
		return this.pickFieldsBy( field => field.isDirty );
	}

	private get enabledFields() {
		return this.pickFieldsBy( field => !field.isDisabled );
	}

	private pickFieldsBy( predicate: ( field: Field<unknown> ) => boolean ): FormFields {
		return pickBy( this._fields, predicate );
	}

	private syncFieldErrors() {
		forEach( this._fields, field => field.syncError() );
	}

	private executeSubmitAction() {
		this._isSubmitting = true;

		return this.submitAction( this )
			.finally( action( () => { this._isSubmitting = false; } ) );
	}

	private showErrorOnField( fieldKey: string, error: string ) {
		this._fields[ fieldKey ]?.showError( error );
	}
}

export type { FormParams, FormValues };

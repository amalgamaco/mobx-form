import { action, makeObservable } from 'mobx';
import Field, { FieldParams } from '../Field';

export default class ManualField<ValueType> extends Field<ValueType> {
	constructor( params: FieldParams<ValueType> ) {
		super( params );

		makeObservable( this, {
			change: action
		} );
	}

	change( newValue: ValueType ) {
		this.setValue( newValue );
		this.syncError();
	}

	set( newValue: ValueType ) {
		this.change( newValue );
	}

	select( newValue: ValueType ) {
		this.change( newValue );
	}
}

export function manualField<ValueType>( params: FieldParams<ValueType> ) {
	return new ManualField<ValueType>( params );
}

import { action, makeObservable } from 'mobx';
import Field, { type FieldParams } from '../../src/Field';

export default class TestField extends Field<string> {
	constructor( params: FieldParams<string> ) {
		super( params );

		makeObservable( this, {
			change: action
		} );
	}

	change( newValue: string ) {
		this.setValue( newValue );
	}
}

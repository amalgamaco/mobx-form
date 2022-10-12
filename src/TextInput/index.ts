import Input from '../Input';
import type { TextInputParams } from './types';

export default class TextInput extends Input<string> {
	constructor( {
		value = '',
		...inputParams
	}: TextInputParams ) {
		super( { value, ...inputParams } );
	}
}

export function textInput( params: TextInputParams ) {
	return new TextInput( params );
}

export type { TextInputParams } from './types';

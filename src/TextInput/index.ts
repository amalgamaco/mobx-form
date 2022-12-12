import Input from '../Input';
import type { TextInputParams } from './types';

export default class TextInput extends Input<string> {
	constructor( {
		defaultValue = '',
		...inputParams
	}: TextInputParams ) {
		super( { defaultValue, ...inputParams } );
	}
}

export function textInput( params: TextInputParams ) {
	return new TextInput( params );
}

export type { TextInputParams };

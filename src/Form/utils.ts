import { mapValues } from 'lodash';
import { FormFields } from './types';

export function wrapInAsyncAction<T>( onSubmit: ( param: T ) => unknown | Promise<unknown> ) {
	return ( param: T ) => Promise.resolve( onSubmit( param ) );
}

export function valuesOf<V, F extends FormFields<V>>(
	fields: F
): { [K in keyof F]: F[K]['value'] } {
	return mapValues( fields, field => field.value );
}

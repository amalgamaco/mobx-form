import { mapValues } from 'lodash';
import { FormFields } from './types';

export function valuesOf( fields: FormFields ) {
	return mapValues( fields, field => field.value );
}

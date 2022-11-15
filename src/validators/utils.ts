import { invalid, valid } from './results';
import type { FieldValidator, MakeValidatorParams } from './types';

export function makeValidator<ValueType>( {
	predicate, message
}: MakeValidatorParams<ValueType> ): FieldValidator<ValueType> {
	return ( value, form, label ) => (
		predicate( value, form )
			? valid()
			: invalid( message.replace( ':label', label || 'Field' ) )
	);
}

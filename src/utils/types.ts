import type Field from '../Field';
import type { FieldParams } from '../Field';

export type ValueType<F> =
	F extends Field<infer V> ? V :
	F extends FieldParams<infer V> ? V :
	never;

export type WithOptionalDefaultValue<FieldParamsType> = Omit<FieldParamsType, 'defaultValue'> & {
	defaultValue?: ValueType<FieldParamsType>
};

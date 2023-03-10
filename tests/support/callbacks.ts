import Field from '../../src/Field';
import Form from '../../src/Form';
import { type ValueType } from '../../src/utils/types';
import { FieldOnChangeCallback } from '../../src/utils/FieldState/types';

interface OnChangeTestParams<F> {
	fieldBuilder: ( onChange: FieldOnChangeCallback<ValueType<F>> ) => F,
	changingAction: ( field: F, value: ValueType<F> ) => void,
	sampleValue: ValueType<F>
}

export function itCallsTheOnChangeCallback<F extends Field<ValueType<F>>>( {
	fieldBuilder,
	changingAction,
	sampleValue
}: OnChangeTestParams<F> ) {
	describe( 'when the field has an onChange callback', () => {
		const setUp = () => {
			const onChange = jest.fn();
			const field = fieldBuilder( onChange );
			const form = new Form( { fields: { field } } );

			return { onChange, field, form };
		};

		describe( 'and a new value is given', () => {
			it( 'calls the callback with the new value and the parent form', () => {
				const { onChange, field, form } = setUp();

				changingAction( field, sampleValue );

				expect( onChange ).toHaveBeenCalledWith( sampleValue, form );
				expect( onChange ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		describe( 'and the same value is given', () => {
			it( 'does not call the callback', () => {
				const { onChange, field } = setUp();

				changingAction( field, field.value );

				expect( onChange ).not.toHaveBeenCalled();
			} );
		} );
	} );
}

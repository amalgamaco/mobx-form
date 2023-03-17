import Field, { type FieldParams } from '../src/Field';
import ManualField from '../src/ManualField';
import { invalid, valid } from '../src/validators';
import { itCallsTheOnChangeCallback } from './support/callbacks';

describe( 'ManualField', () => {
	const after2021 = ( value: Date ) => (
		value.getFullYear() > 2021 ? valid() : invalid( 'Date is invalid' )
	);
	const createField = ( params?: Partial<FieldParams<Date>> ) => new ManualField<Date>( {
		defaultValue: new Date(),
		value: new Date( 2022, 10, 10 ),
		validators: [ after2021 ],
		...params
	} );

	const itChangesTheFieldValue = (
		changingAction: ( field: ManualField<Date>, value: Date ) => void
	) => {
		it( 'updates the value of the field with the given one', () => {
			const field = createField();
			const newValue = new Date( 2022, 12, 3 );

			changingAction( field, newValue );

			expect( field.value ).toEqual( newValue );
		} );

		it( 'shows the error if the new value is not valid', () => {
			const field = createField();

			changingAction( field, new Date( 2021, 11, 31 ) );

			expect( field.error ).toEqual( 'Date is invalid' );
		} );

		it( 'hides the error if the old value was invalid and the new one is not', () => {
			const field = createField();

			changingAction( field, new Date( 2021, 11, 31 ) );
			changingAction( field, new Date( 2022, 0, 1 ) );

			expect( field.error ).toEqual( '' );
		} );

		itCallsTheOnChangeCallback<ManualField<Date>>( {
			fieldBuilder: onChange => createField( { onChange } ),
			changingAction,
			sampleValue: new Date()
		} );
	};

	it( 'is a Field', () => {
		const field = createField();

		expect( field ).toBeInstanceOf( Field );
	} );

	describe( '@change', () => {
		itChangesTheFieldValue( ( field, value ) => field.change( value ) );
	} );

	describe( '@set', () => {
		itChangesTheFieldValue( ( field, value ) => field.set( value ) );
	} );

	describe( '@select', () => {
		itChangesTheFieldValue( ( field, value ) => field.select( value ) );
	} );
} );

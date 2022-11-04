import Field from '../src/Field';
import ManualField from '../src/ManualField';
import { invalid, valid } from '../src/validators';

describe( 'ManualField', () => {
	const after2021 = ( value: Date ) => (
		value.getFullYear() > 2021 ? valid() : invalid( 'Date is invalid' )
	);
	const createField = () => new ManualField<Date>( {
		value: new Date( 2022, 10, 10 ),
		validators: [ after2021 ]
	} );

	it( 'is a Field', () => {
		const field = createField();

		expect( field ).toBeInstanceOf( Field );
	} );

	describe( '@change', () => {
		it( 'updates the value of the field with the given one', () => {
			const field = createField();
			const newValue = new Date( 2022, 12, 3 );

			field.change( newValue );

			expect( field.value ).toEqual( newValue );
		} );

		it( 'shows the error if the new value is not valid', () => {
			const field = createField();

			field.change( new Date( 2021, 11, 31 ) );

			expect( field.error ).toEqual( 'Date is invalid' );
		} );

		it( 'hides the error if the old value was invalid and the new one is not', () => {
			const field = createField();

			field.change( new Date( 2021, 11, 31 ) );
			field.change( new Date( 2022, 0, 1 ) );

			expect( field.error ).toEqual( '' );
		} );
	} );
} );

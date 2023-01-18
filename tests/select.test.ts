import ManualField from '../src/ManualField';
import select, { type SelectParams } from '../src/select';

describe( 'select', () => {
	const createSelect = (
		params?: Partial<SelectParams<string>>
	) => select<string>( {
		label: 'Favorite language',
		...params
	} );

	it( 'returns a ManualField', () => {
		const field = createSelect();

		expect( field ).toBeInstanceOf( ManualField );
	} );

	describe( 'when no default value is given', () => {
		it( 'uses null as the field\'s default value', () => {
			const field = createSelect();

			expect( field.value ).toBeNull();
		} );
	} );

	describe( 'when a default value is given', () => {
		it( 'uses that value as the field\'s default value', () => {
			const field = createSelect( { defaultValue: 'Ruby' } );

			expect( field.value ).toEqual( 'Ruby' );
		} );
	} );
} );

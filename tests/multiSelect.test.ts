import ManualField from '../src/ManualField';
import multiSelect, { type MultiSelectParams } from '../src/multiSelect';

describe( 'multiSelect', () => {
	const createMultiSelect = (
		params?: Partial<MultiSelectParams<number>>
	) => multiSelect<number>( {
		label: 'Numbers of interest',
		...params
	} );

	it( 'returns a ManualField', () => {
		const field = createMultiSelect();

		expect( field ).toBeInstanceOf( ManualField );
	} );

	describe( 'when no default value is given', () => {
		it( 'uses an empty array as the field\'s default value', () => {
			const field = createMultiSelect();

			expect( field.value ).toEqual( [] );
		} );
	} );

	describe( 'when a default value is given', () => {
		it( 'uses that value as the field\'s default value', () => {
			const field = createMultiSelect( { defaultValue: [ 5, 6 ] } );

			expect( field.value ).toEqual( [ 5, 6 ] );
		} );
	} );
} );

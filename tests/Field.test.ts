import Field from '../src/Field';
import type { FieldParams } from '../src/Field';

describe( 'Field', () => {
	const label = 'A field';
	const hint = 'Some hint';
	const initialValue = 'Content';
	const disabled = false;

	const createField = ( params?: Partial<FieldParams<string>> ) => new Field<string>( {
		label,
		hint,
		value: initialValue,
		disabled,
		...params
	} );

	describe( 'constructor', () => {
		it( 'assigns the given attributes to the field', () => {
			const field = createField();

			expect( field.label ).toEqual( label );
			expect( field.hint ).toEqual( hint );
			expect( field.value ).toEqual( initialValue );
			expect( field.isDisabled ).toEqual( disabled );
		} );

		describe( 'without the optional attributes', () => {
			it( 'assigns default values for them', () => {
				const field = createField( { label: undefined, hint: undefined, disabled: undefined } );

				expect( field.label ).toEqual( '' );
				expect( field.hint ).toEqual( '' );
				expect( field.isDisabled ).toBe( false );
			} );
		} );
	} );

	describe( '@isDirty', () => {
		describe( 'when the field\'s value has not changed', () => {
			it( 'returns false', () => {
				const field = createField();

				expect( field.isDirty ).toBe( false );
			} );
		} );

		describe( 'when the field\'s value has changed', () => {
			it( 'returns true', () => {
				const field = createField();

				field.change( 'Other content' );

				expect( field.isDirty ).toBe( true );
			} );

			describe( 'but is then changed to the initial value given in constructor', () => {
				it( 'returns false', () => {
					const field = createField();

					field.change( 'Other content' );
					field.change( initialValue );

					expect( field.isDirty ).toBe( false );
				} );
			} );
		} );
	} );

	describe( '@change', () => {
		it( 'updates the value of the field with the given one', () => {
			const field = createField();

			field.change( 'New content' );

			expect( field.value ).toEqual( 'New content' );
		} );
	} );

	describe( '@reset', () => {
		it( 'resets the value of the field with the value given in constructor', () => {
			const field = createField();

			field.change( 'New content' );
			field.reset();

			expect( field.value ).toEqual( initialValue );
		} );
	} );
} );

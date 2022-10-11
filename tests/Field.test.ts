import Field from '../src/Field';
import type { FieldParams } from '../src/Field';
import Form from '../src/Form';

describe( 'Field', () => {
	const label = 'A field';
	const hint = 'Some hint';
	const initialValue = 'Content';
	const presenceValidator = ( value: string ) => ( value ? '' : 'This is required.' );
	const lengthValidator = ( value: string ) => ( value.length <= 7 ? '' : 'Too long!' );
	const disabled = false;

	const createField = ( params?: Partial<FieldParams<string>> ) => new Field<string>( {
		label,
		hint,
		value: initialValue,
		validators: [ presenceValidator, lengthValidator ],
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

	describe( '@isValid', () => {
		describe( 'when the field is constructed with a value not accepted by a validator', () => {
			it( 'returns false', () => {
				const field = createField( { value: 'Too long' } );

				expect( field.isValid ).toBe( false );
			} );
		} );

		describe( 'when the field is constructed with a value accepted by all validators', () => {
			it( 'returns true', () => {
				const field = createField( { value: 'Ok' } );

				expect( field.isValid ).toBe( true );
			} );

			describe( 'but is then updated with a value not accepted by a validator', () => {
				it( 'returns false', () => {
					const field = createField( { value: 'Ok' } );

					field.change( '' );

					expect( field.isValid ).toBe( false );
				} );
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

	describe( '@attachToForm', () => {
		const createAndAttachField = () => {
			const validator = jest.fn(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				( _value: string, _form?: Form, _label?: string ) => ''
			);

			const form = new Form( {
				fields: {},
				onSubmit: () => Promise.resolve()
			} );

			const field = createField( { validators: [ validator ] } );

			field.attachToForm( form );

			return { field, form, validator };
		};

		describe( 'when the field is not attached to any form', () => {
			it( 'starts passing the given form and field key to the validators', () => {
				const { field, form, validator } = createAndAttachField();

				// eslint-disable-next-line no-unused-expressions
				field.isValid;

				expect( validator ).toHaveBeenCalledWith( field.value, form, field.label );
			} );
		} );

		describe( 'when the field is already attached to a form', () => {
			it( 'throws a runtime error', () => {
				const { field, form } = createAndAttachField();

				expect( () => field.attachToForm( form ) ).toThrow( Error );
			} );
		} );
	} );
} );

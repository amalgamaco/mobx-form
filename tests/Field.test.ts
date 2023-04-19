import TestField from './support/TestField';
import type { FieldParams } from '../src/Field';
import Form from '../src/Form';
import { invalid, valid } from '../src/validators';

describe( 'Field', () => {
	const label = 'A field';
	const hint = 'Some hint';
	const initialValue = 'Content';
	const defaultValue = 'Defval';
	const presenceValidator = ( value: string ) => (
		value ? valid() : invalid( 'This is required.' )
	);
	const lengthValidator = ( value: string ) => (
		value.length <= 7 ? valid() : invalid( 'Too long!' )
	);

	const createField = ( params?: Partial<FieldParams<string>> ) => new TestField( {
		label,
		hint,
		defaultValue,
		value: initialValue,
		validators: [ presenceValidator, lengthValidator ],
		disabled: false,
		...params
	} );

	const createInvalidField = () => createField( { value: 'Too loong' } );

	describe( 'constructor', () => {
		it( 'assigns the given attributes to the field', () => {
			const field = createField();

			expect( field.label ).toEqual( label );
			expect( field.hint ).toEqual( hint );
			expect( field.value ).toEqual( initialValue );
			expect( field.isDisabled ).toEqual( false );

			const disabledField = createField( { disabled: true } );

			expect( disabledField.isDisabled ).toEqual( true );
		} );

		describe( 'without label, hint and disabled attributes', () => {
			it( 'assigns default values for them', () => {
				const field = createField( { label: undefined, hint: undefined, disabled: undefined } );

				expect( field.label ).toEqual( '' );
				expect( field.hint ).toEqual( '' );
				expect( field.isDisabled ).toBe( false );
			} );
		} );

		describe( 'without value', () => {
			it( 'assigns the given defaultValue as the initial value', () => {
				const field = createField( { value: undefined, hint: undefined, disabled: undefined } );

				expect( field.value ).toBe( defaultValue );
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

	describe( '@setIsDisabled', () => {
		describe( 'when called with false', () => {
			it( 'sets the field as enabled', () => {
				const field = createField( { disabled: true } );

				field.setIsDisabled( false );

				expect( field.isDisabled ).toBe( false );
			} );
		} );

		describe( 'when called with true', () => {
			it( 'sets the field as disabled', () => {
				const field = createField( { disabled: false } );

				field.setIsDisabled( true );

				expect( field.isDisabled ).toBe( true );
			} );
		} );
	} );

	describe( '@clear', () => {
		it( 'sets the defaultValue given in constructor as the new value', () => {
			const field = createField();

			field.clear();

			expect( field.value ).toEqual( defaultValue );
		} );

		it( 'stops showing the error message', () => {
			const field = createField();

			field.change( '' );
			field.syncError();
			field.clear();

			expect( field.error ).toEqual( '' );
		} );
	} );

	describe( '@reset', () => {
		it( 'resets the value of the field with the value given in constructor', () => {
			const field = createField();

			field.change( 'New content' );
			field.reset();

			expect( field.value ).toEqual( initialValue );
		} );

		it( 'stops showing the error message', () => {
			const field = createField();

			field.change( '' );
			field.syncError();
			field.reset();

			expect( field.error ).toEqual( '' );
		} );
	} );

	describe( '@syncError', () => {
		describe( 'when the field is valid', () => {
			describe( 'and no error is being shown', () => {
				it( 'does not show any error message on the field', () => {
					const field = createField();

					field.syncError();

					expect( field.error ).toEqual( '' );
				} );
			} );

			describe( 'and an error is being shown', () => {
				it( 'hides the shown error message', () => {
					const field = createField();

					field.change( '' );
					field.syncError();
					field.change( 'good' );
					field.syncError();

					expect( field.error ).toEqual( '' );
				} );
			} );
		} );

		describe( 'when the field is invalid', () => {
			describe( 'and no error is being shown', () => {
				it( 'shows the error message of the first failing validator', () => {
					const field = createField();

					field.change( 'quite long' );
					field.syncError();

					expect( field.error ).toEqual( 'Too long!' );
				} );
			} );

			describe( 'and an error is being shown', () => {
				it( 'shows the error message of the first failing validator', () => {
					const field = createField();

					field.change( 'quite long' );
					field.syncError();
					field.change( '' );
					field.syncError();

					expect( field.error ).toEqual( 'This is required.' );
				} );
			} );
		} );
	} );

	describe( '@showError', () => {
		it( 'displays the given error on the field', () => {
			const field = createField();
			const error = 'That value is already being used';

			field.showError( error );

			expect( field.error ).toEqual( error );
		} );
	} );

	describe( '@clearError', () => {
		describe( 'when no error is being shown', () => {
			it( 'does not show any error', () => {
				const field = createInvalidField();

				field.clearError();

				expect( field.error ).toEqual( '' );
			} );
		} );

		describe( 'when an error is being shown', () => {
			describe( 'and it was manually set', () => {
				it( 'hides the error', () => {
					const field = createField();

					field.showError( 'Something went wrong' );
					field.clearError();

					expect( field.error ).toBe( '' );
				} );
			} );

			describe( 'and it comes from a failed validation', () => {
				it( 'hides the error', () => {
					const field = createInvalidField();

					field.syncError();
					field.clearError();

					expect( field.error ).toBe( '' );
				} );
			} );
		} );
	} );

	describe( '@attachToForm', () => {
		const createAndAttachField = () => {
			const validator = jest.fn(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				( _value: string, _form?: Form, _label?: string ) => valid()
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

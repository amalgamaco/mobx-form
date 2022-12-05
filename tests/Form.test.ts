import ManualField from '../src/ManualField';
import TestField from './support/TestField';
import Form, { FormParams } from '../src/Form';
import { invalid, valid } from '../src/validators';

describe( 'Form', () => {
	const required = ( value: string ) => (
		value ? valid() : invalid( 'This field is required.' )
	);
	const atLeastEightChars = ( value: string ) => (
		value.length >= 8 ? valid() : invalid( 'At least eight chars.' )
	);
	const matchPassword = ( value: string, form?: Form ) => (
		value === form?.select( 'password' ).value ? valid() : invalid( 'Password does not match' )
	);

	const fields = {
		email: {
			label: 'Email',
			hint: 'Write it with a known domain',
			value: 'autofilled@test.com',
			validators: [ required ],
			disabled: false
		},
		password: {
			label: 'Password',
			hint: 'At least 8 characters',
			value: '',
			validators: [ required, atLeastEightChars ],
			disabled: false
		},
		passwordConfirmation: {
			label: 'Password confirmation',
			value: '',
			validators: [ required, matchPassword ]
		},
		document: {
			label: 'Document',
			value: 'unused',
			validators: [ atLeastEightChars ],
			disabled: true
		},
		admin: {
			label: 'Admin?',
			value: true
		}
	};

	const onSubmit = jest.fn( () => Promise.resolve() );

	const createForm = ( params?: Partial<FormParams> ) => new Form( {
		fields: {
			email: new TestField( fields.email ),
			password: new TestField( fields.password ),
			passwordConfirmation: new TestField( fields.passwordConfirmation ),
			document: new TestField( fields.document ),
			admin: new ManualField( fields.admin )
		},
		onSubmit,
		...params
	} );

	const createFormAndMakeItValid = ( params?: Partial<FormParams> ) => {
		const form = createForm( params );

		form.select<TestField>( 'password' ).change( 'validpass' );
		form.select<TestField>( 'passwordConfirmation' ).change( 'validpass' );

		return form;
	};

	afterEach( () => jest.clearAllMocks() );

	describe( '@values', () => {
		it( 'returns an object with values per field key', () => {
			const form = createForm();

			expect( form.values ).toEqual( {
				email: fields.email.value,
				password: fields.password.value,
				passwordConfirmation: fields.passwordConfirmation.value,
				document: fields.document.value,
				admin: fields.admin.value
			} );
		} );
	} );

	describe( '@dirtyValues', () => {
		describe( 'when no field is dirty', () => {
			it( 'returns an empty object', () => {
				const form = createForm();

				expect( form.dirtyValues ).toEqual( {} );
			} );
		} );

		describe( 'when one or more fields are dirty', () => {
			it( 'returns the values of the dirty fields', () => {
				const form = createForm();

				form.select<TestField>( 'email' ).change( 'new@test.com' );
				form.select<ManualField<boolean>>( 'admin' ).change( false );

				expect( form.dirtyValues ).toEqual( {
					email: 'new@test.com',
					admin: false
				} );
			} );
		} );
	} );

	describe( '@isValid', () => {
		describe( 'when all fields are valid', () => {
			it( 'returns true', () => {
				const form = createFormAndMakeItValid();
				form.select<TestField>( 'document' ).change( 'validdoc' );

				expect( form.isValid ).toBe( true );
			} );
		} );

		describe( 'when only disabled fields are invalid', () => {
			it( 'returns true', () => {
				const form = createFormAndMakeItValid();

				expect( form.isValid ).toBe( true );
			} );
		} );

		describe( 'when at least one enabled field is invalid', () => {
			it( 'returns false', () => {
				const form = createFormAndMakeItValid();

				form.select<TestField>( 'passwordConfirmation' ).change( 'is not the password' );

				expect( form.isValid ).toBe( false );
			} );
		} );
	} );

	describe( '@isDirty', () => {
		describe( 'when no field is dirty', () => {
			it( 'returns false', () => {
				const form = createForm();

				expect( form.isDirty ).toBe( false );
			} );
		} );

		describe( 'when one or more fields are dirty', () => {
			it( 'returns true', () => {
				const form = createForm();

				form.select<TestField>( 'password' ).change( 'sekret' );

				expect( form.isDirty ).toBe( true );
			} );
		} );
	} );

	describe( '@isReadyToSubmit', () => {
		describe( 'when one or more fields are invalid', () => {
			it( 'returns false', () => {
				const form = createForm();

				expect( form.isReadyToSubmit ).toBe( false );
			} );
		} );

		describe( 'when the form is not dirty', () => {
			it( 'returns false', () => {
				const form = createForm( {
					fields: {
						email: new TestField( fields.email )
					}
				} );

				expect( form.isReadyToSubmit ).toBe( false );
			} );
		} );

		describe( 'when the form is being submitted', () => {
			it( 'returns false', () => {
				const form = createFormAndMakeItValid();

				form.submit();

				expect( form.isReadyToSubmit ).toBe( false );
			} );
		} );

		describe( 'when the form is valid, dirty and is not being submitted', () => {
			it( 'returns true', () => {
				const form = createFormAndMakeItValid();

				expect( form.isReadyToSubmit ).toBe( true );
			} );
		} );
	} );

	describe( '@select', () => {
		it( 'returns the field that has the given key', () => {
			const form = createForm();

			const documentField = form.select<TestField>( 'document' );

			expect( documentField.label ).toEqual( 'Document' );
			expect( documentField.value ).toEqual( 'unused' );
			expect( documentField.isDisabled ).toBe( true );
		} );
	} );

	describe( '@submit', () => {
		it( 'syncronizes the errors of all fields', () => {
			const form = createFormAndMakeItValid();
			const email = form.select<TestField>( 'email' );
			const password = form.select<TestField>( 'password' );
			email.change( '' );
			email.syncError();
			email.change( 'valid@again.com' );
			password.change( 'short' );

			form.submit();

			expect( email.error ).toEqual( '' );
			expect( password.error ).toEqual( 'At least eight chars.' );
		} );

		describe( 'when the form is valid and is not being submitted', () => {
			it( 'calls the onSubmit callback with itself as parameter', () => {
				const form = createFormAndMakeItValid();

				form.submit();

				expect( onSubmit ).toHaveBeenCalledWith( form );
			} );

			it( 'sets isSubmitting to true', () => {
				const form = createFormAndMakeItValid();

				form.submit();

				expect( form.isSubmitting ).toBe( true );
			} );

			describe( 'when the onSubmit promise is resolved', () => {
				it( 'sets isSubmitting to false again', async () => {
					const form = createFormAndMakeItValid();

					await form.submit();

					expect( form.isSubmitting ).toBe( false );
				} );
			} );

			describe( 'when the onSubmit promise is rejected', () => {
				beforeEach( () => onSubmit.mockRejectedValueOnce( 'error' ) );

				it( 'sets isSubmitting to false again and the returned promise is rejected', async () => {
					expect.assertions( 1 );
					const form = createFormAndMakeItValid();

					try {
						await form.submit();
					} catch {
						expect( form.isSubmitting ).toBe( false );
					}
				} );
			} );

			describe( 'when the onSubmit callback does not return anything', () => {
				it( 'returns a resolved promise', async () => {
					const form = createForm( { onSubmit: () => undefined } );

					await expect( form.submit() ).resolves.not.toThrow();
				} );
			} );
		} );

		describe( 'when the form is invalid', () => {
			it( 'does not call the onSubmit callback', () => {
				const form = createForm();

				form.submit();

				expect( onSubmit ).not.toHaveBeenCalled();
			} );

			it( 'returns a resolved promise', async () => {
				const form = createForm();

				form.submit();

				await expect( form.submit() ).resolves.not.toThrow();
			} );
		} );

		describe( 'when the form is being submitted', () => {
			it( 'does not call the onSubmit callback', () => {
				const form = createFormAndMakeItValid();

				form.submit();
				form.submit();

				expect( onSubmit ).toHaveBeenCalledTimes( 1 );
			} );

			it( 'returns a resolved promise', async () => {
				const form = createFormAndMakeItValid();

				form.submit();

				await expect( form.submit() ).resolves.not.toThrow();
			} );
		} );
	} );

	describe( '@reset', () => {
		it( 'resets the value of each field', () => {
			const form = createForm();

			form.select<TestField>( 'email' ).change( 'dirty@test.com' );
			form.select<TestField>( 'password' ).change( 'dirty' );
			form.reset();

			expect( form.values ).toEqual( {
				email: fields.email.value,
				password: fields.password.value,
				passwordConfirmation: fields.passwordConfirmation.value,
				document: fields.document.value,
				admin: fields.admin.value
			} );
		} );

		it( 'clears the error message of each field', () => {
			const form = createForm();

			form.select<TestField>( 'email' ).change( '' );
			form.select<TestField>( 'password' ).change( '' );
			form.submit();

			form.reset();

			[ 'email', 'password', 'passwordConfirmation', 'document', 'admin' ].forEach( ( key ) => {
				expect( form.select( key ).error ).toEqual( '' );
			} );
		} );
	} );

	describe( '@showErrors', () => {
		it( 'shows the given errors on the fields', () => {
			const form = createForm();
			const errors = {
				email: 'This email is being used',
				document: 'This document failed the external validation'
			};

			form.showErrors( {
				email: 'This email is being used',
				document: 'This document failed the external validation'
			} );

			expect( form.select( 'email' ).error ).toEqual( errors.email );
			expect( form.select( 'document' ).error ).toEqual( errors.document );
		} );

		it( 'ignores errors for fields that do not exist', () => {
			const form = createForm();

			expect( () => form.showErrors( { age: 'Invalid' } ) ).not.toThrow();
		} );
	} );
} );

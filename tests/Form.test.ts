import Field from '../src/Field';
import Form from '../src/Form';

describe( 'Form', () => {
	const fields = {
		email: {
			label: 'Email',
			hint: 'Write it with a known domain',
			value: 'autofilled@test.com',
			disabled: false
		},
		password: {
			label: 'Password',
			hint: 'At least 8 characters',
			value: '',
			disabled: false
		},
		document: {
			label: 'Document',
			value: 'unused',
			disabled: true
		},
		admin: {
			label: 'Admin?',
			value: true
		}
	};

	const onSubmit = jest.fn( () => Promise.resolve() );

	const createForm = () => new Form( {
		fields: {
			email: new Field( fields.email ),
			password: new Field( fields.password ),
			document: new Field( fields.document ),
			admin: new Field( fields.admin )
		},
		onSubmit
	} );

	afterEach( () => jest.clearAllMocks() );

	describe( '@values', () => {
		it( 'returns an object with values per field key', () => {
			const form = createForm();

			expect( form.values ).toEqual( {
				email: fields.email.value,
				password: fields.password.value,
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

				form.select( 'email' ).change( 'new@test.com' );
				form.select( 'admin' ).change( false );

				expect( form.dirtyValues ).toEqual( {
					email: 'new@test.com',
					admin: false
				} );
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

				form.select( 'password' ).change( 'sekret' );

				expect( form.isDirty ).toBe( true );
			} );
		} );
	} );

	describe( '@isReadyToSubmit', () => {
		describe( 'when the form is not dirty', () => {
			it( 'returns false', () => {
				const form = createForm();

				expect( form.isReadyToSubmit ).toBe( false );
			} );
		} );

		describe( 'when the form is being submitted', () => {
			it( 'returns false', () => {
				const form = createForm();

				form.select( 'email' ).change( 'test@test.com' );
				form.submit();

				expect( form.isReadyToSubmit ).toBe( false );
			} );
		} );

		describe( 'when the form is dirty and is not being submitted', () => {
			it( 'returns true', () => {
				const form = createForm();

				form.select( 'email' ).change( 'test@test.com' );

				expect( form.isReadyToSubmit ).toBe( true );
			} );
		} );
	} );

	describe( '@select', () => {
		it( 'returns the field that has the given key', () => {
			const form = createForm();

			const documentField = form.select<Field<string>>( 'document' );

			expect( documentField.label ).toEqual( 'Document' );
			expect( documentField.value ).toEqual( 'unused' );
			expect( documentField.isDisabled ).toBe( true );
		} );
	} );

	describe( '@submit', () => {
		describe( 'when the form is not being submitted', () => {
			it( 'calls the onSubmit callback with itself as parameter', () => {
				const form = createForm();

				form.submit();

				expect( onSubmit ).toHaveBeenCalledWith( form );
			} );

			it( 'sets isSubmitting to true', () => {
				const form = createForm();

				form.submit();

				expect( form.isSubmitting ).toBe( true );
			} );

			describe( 'when the onSubmit promise is resolved', () => {
				it( 'sets isSubmitting to false again', async () => {
					const form = createForm();

					await form.submit();

					expect( form.isSubmitting ).toBe( false );
				} );
			} );

			describe( 'when the onSubmit promise is rejected', () => {
				beforeEach( () => onSubmit.mockRejectedValueOnce( 'error' ) );

				it( 'sets isSubmitting to false again and the returned promise is rejected', async () => {
					expect.assertions( 1 );
					const form = createForm();

					try {
						await form.submit();
					} catch {
						expect( form.isSubmitting ).toBe( false );
					}
				} );
			} );
		} );

		describe( 'when the form is being submitted', () => {
			it( 'does not call the onSubmit callback', () => {
				const form = createForm();

				form.submit();
				form.submit();

				expect( onSubmit ).toHaveBeenCalledTimes( 1 );
			} );

			it( 'returns a resolved promise', async () => {
				const form = createForm();

				form.submit();

				await expect( form.submit() ).resolves.not.toThrow();
			} );
		} );
	} );

	describe( '@reset', () => {
		it( 'resets all the fields', () => {
			const form = createForm();

			form.select( 'email' ).change( 'dirty@test.com' );
			form.select( 'password' ).change( 'dirty' );
			form.reset();

			expect( form.values ).toEqual( {
				email: fields.email.value,
				password: fields.password.value,
				document: fields.document.value,
				admin: fields.admin.value
			} );
		} );
	} );
} );

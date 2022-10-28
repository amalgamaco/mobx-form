import Field from '../src/Field';
import Input, { type InputParams } from '../src/Input';

describe( 'Input', () => {
	const lengthValidator = ( value: string ) => ( value.length >= 8 ? '' : 'Too short' );

	const createInput = ( params?: Partial<InputParams<string>> ) => new Input<string>( {
		label: 'Username',
		placeholder: 'AwesomeUser',
		hint: 'Type 5 or more characters',
		value: 'initial value',
		validators: [ lengthValidator ],
		disabled: false,
		showErrors: 'onWrite',
		...params
	} );

	it( 'is a Field', () => {
		const input = createInput();

		expect( input ).toBeInstanceOf( Field );
	} );

	describe( 'constructor', () => {
		it( 'creates the input with the given parameters', () => {
			const input = createInput();

			expect( input.label ).toEqual( 'Username' );
			expect( input.placeholder ).toEqual( 'AwesomeUser' );
			expect( input.hint ).toEqual( 'Type 5 or more characters' );
			expect( input.value ).toEqual( 'initial value' );
			expect( input.isDisabled ).toBe( false );
		} );

		describe( 'without the optional attributes', () => {
			it( 'assigns default values for them', () => {
				const input = new Input<string>( { value: 'initial value' } );

				expect( input.label ).toEqual( '' );
				expect( input.placeholder ).toEqual( '' );
				expect( input.hint ).toEqual( '' );
				expect( input.isDisabled ).toBe( false );
			} );
		} );
	} );

	describe( '@focus', () => {
		describe( 'when the input is not focused', () => {
			it( 'sets the isFocused prop to true', () => {
				const input = createInput();

				input.focus();

				expect( input.isFocused ).toBe( true );
			} );
		} );

		describe( 'when the input is focused', () => {
			it( 'does not change the isFocused prop', () => {
				const input = createInput();

				input.focus();
				input.focus();

				expect( input.isFocused ).toBe( true );
			} );
		} );
	} );

	describe( '@write', () => {
		it( 'changes the value of the input with the given one', () => {
			const input = createInput();

			input.write( 'new value' );

			expect( input.value ).toEqual( 'new value' );
		} );

		it( 'focuses the input', () => {
			const input = createInput();

			input.write( 'new value' );

			expect( input.isFocused ).toBe( true );
		} );
	} );

	describe( '@blur', () => {
		describe( 'when the input is not focused', () => {
			it( 'does not change the isFocused prop', () => {
				const input = createInput();

				input.blur();

				expect( input.isFocused ).toBe( false );
			} );
		} );

		describe( 'when the input is focused', () => {
			it( 'sets the isFocused prop to false', () => {
				const input = createInput();

				input.focus();
				input.blur();

				expect( input.isFocused ).toBe( false );
			} );
		} );
	} );

	describe( 'error display configs', () => {
		describe( 'onWrite config', () => {
			describe( 'when a value is written', () => {
				describe( 'and it is invalid', () => {
					test( 'the input shows the error', () => {
						const input = createInput( { showErrors: 'onWrite' } );

						input.write( 'short' );

						expect( input.error ).toEqual( 'Too short' );
					} );
				} );

				describe( 'and it is valid', () => {
					test( 'the input hides any error being shown', () => {
						const input = createInput( { showErrors: 'onWrite' } );

						input.write( 'short' );
						input.write( 'valid again' );

						expect( input.error ).toEqual( '' );
					} );
				} );
			} );
		} );

		describe( 'onBlur config', () => {
			describe( 'when a value is written', () => {
				describe( 'and it is invalid', () => {
					test( 'the input shows the error only when blurred', () => {
						const input = createInput( { showErrors: 'onBlur' } );

						input.write( 'short' );
						expect( input.error ).toEqual( '' );

						input.blur();
						expect( input.error ).toEqual( 'Too short' );
					} );
				} );

				describe( 'and it is valid', () => {
					test( 'the input hides any error being shown', () => {
						const input = createInput( { showErrors: 'onBlur' } );

						input.write( 'short' );
						input.blur();

						input.write( 'valid again' );

						expect( input.error ).toEqual( '' );
					} );
				} );
			} );
		} );

		describe( 'onSubmit config', () => {
			describe( 'when a value is written', () => {
				describe( 'and it is invalid', () => {
					test( 'the input does not show the error', () => {
						const input = createInput( { showErrors: 'onSubmit' } );

						input.write( 'short' );
						expect( input.error ).toEqual( '' );

						input.blur();
						expect( input.error ).toEqual( '' );
					} );
				} );

				describe( 'and it is valid', () => {
					test( 'the input hides any error being shown', () => {
						const input = createInput( { showErrors: 'onSubmit' } );

						input.write( 'short' );
						input.syncError();

						input.write( 'valid again' );

						expect( input.error ).toEqual( '' );
					} );
				} );
			} );
		} );
	} );
} );

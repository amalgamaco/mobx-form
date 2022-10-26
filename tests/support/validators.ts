import { FieldValidator, ValidationResult } from '../../src/validators';

export function expectSuccessfulValidation( result: ValidationResult ) {
	expect( result.isValid ).toBe( true );
}

export function expectFailedValidation( result: ValidationResult, expectedError: string ) {
	expect( result.isValid ).toBe( false );
	expect( result.error ).toBe( expectedError );
}

export function itIncludesTheLabelInTheErrorMessage<T>( {
	validatorBuilder,
	sampleInvalidValue
}: {
	validatorBuilder: ( message: string ) => FieldValidator<T>,
	sampleInvalidValue: T
} ) {
	describe( 'when the validator is configured with a message containing the :label keyword', () => {
		describe( 'and it is invoked with a label', () => {
			it( 'replaces the :label keyword with the label when returning an error', () => {
				const validator = validatorBuilder( 'The field :label is invalid' );
				const result = validator( sampleInvalidValue, undefined, 'Role' );

				expect( result.error ).toEqual( 'The field Role is invalid' );
			} );
		} );

		describe( 'and it is invoked without a label', () => {
			it( 'replaces the :label keyword with the word "Field" when returning an error', () => {
				const validator = validatorBuilder( ':label is invalid' );
				const result = validator( sampleInvalidValue, undefined );

				expect( result.error ).toEqual( 'Field is invalid' );
			} );
		} );
	} );
}

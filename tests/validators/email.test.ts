import { email } from '../../src/validators';
import {
	expectFailedValidation, expectSuccessfulValidation, itIncludesTheLabelInTheErrorMessage
} from '../support/validators';

describe( 'email validator', () => {
	const config = { message: 'The email is not valid!' };
	const validator = email( config );

	describe( 'when the string has a valid email format', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( 'valid@test.co' ) );
		} );
	} );

	describe( 'when the string has an invalid email format', () => {
		it( 'fails the validation', () => {
			expectFailedValidation( validator( 'invalid@test,co' ), config.message );
			expectFailedValidation( validator( 'invalidtest.co' ), config.message );
		} );
	} );

	itIncludesTheLabelInTheErrorMessage( {
		validatorBuilder: message => email( { message } ),
		sampleInvalidValue: 'not.valid.com'
	} );
} );

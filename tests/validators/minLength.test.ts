import { minLength } from '../../src/validators';
import {
	expectFailedValidation, expectSuccessfulValidation, itIncludesTheLabelInTheErrorMessage
} from '../support/validators';

describe( 'minLength validator', () => {
	const config = { message: 'At least :length chars' };
	const expectedError = 'At least 8 chars';
	const validator = minLength( 8, config );

	describe( 'when the string\'s length equals the given length for the validator', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( '8--chars' ) );
		} );
	} );

	describe( 'when the string\'s length is greater than the given length for the validator', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( 'very long string' ) );
		} );
	} );

	describe( 'when the string\'s length is less than the given length for the validator', () => {
		it( 'fails the validation with a message containing the expected min length', () => {
			expectFailedValidation( validator( '=short=' ), expectedError );
		} );
	} );

	itIncludesTheLabelInTheErrorMessage( {
		validatorBuilder: message => minLength( 3, { message } ),
		sampleInvalidValue: 'XY'
	} );
} );

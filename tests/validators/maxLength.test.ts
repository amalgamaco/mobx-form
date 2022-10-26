import { maxLength } from '../../src/validators';
import {
	expectFailedValidation, expectSuccessfulValidation, itIncludesTheLabelInTheErrorMessage
} from '../support/validators';

describe( 'maxLength validator', () => {
	const config = { message: 'At most :length chars' };
	const expectedError = 'At most 5 chars';
	const validator = maxLength( 5, config );

	describe( 'when the string\'s length equals the given length for the validator', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( '12345' ) );
		} );
	} );

	describe( 'when the string\'s length is less than the given length for the validator', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( 'A' ) );
		} );
	} );

	describe( 'when the string\'s length is greater than the given length for the validator', () => {
		it( 'fails the validation with a message containing the expected min length', () => {
			expectFailedValidation( validator( 'xyz123' ), expectedError );
		} );
	} );

	itIncludesTheLabelInTheErrorMessage( {
		validatorBuilder: message => maxLength( 4, { message } ),
		sampleInvalidValue: '5char'
	} );
} );

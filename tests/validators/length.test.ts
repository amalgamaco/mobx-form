import { length } from '../../src/validators';
import {
	expectFailedValidation, expectSuccessfulValidation, itIncludesTheLabelInTheErrorMessage
} from '../support/validators';

describe( 'length validator', () => {
	const config = { message: 'Must have :length chars' };
	const expectedError = 'Must have 9 chars';
	const validator = length( 9, config );

	describe( 'when the string\'s length equals the given length for the validator', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( 'ninechars' ) );
		} );
	} );

	describe( 'when the string\'s length is less than the given length for the validator', () => {
		it( 'fails the validation with a message containing the expected length', () => {
			expectFailedValidation( validator( 'tooshort' ), expectedError );
		} );
	} );

	describe( 'when the string\'s length is greater than the given length for the validator', () => {
		it( 'fails the validation with a message containing the expected length', () => {
			expectFailedValidation( validator( 'toolongggg' ), expectedError );
		} );
	} );

	itIncludesTheLabelInTheErrorMessage( {
		validatorBuilder: message => length( 3, { message } ),
		sampleInvalidValue: 'four'
	} );
} );

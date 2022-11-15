import { required } from '../../src/validators';
import {
	expectFailedValidation, expectSuccessfulValidation, itIncludesTheLabelInTheErrorMessage
} from '../support/validators';

describe( 'required validator', () => {
	const config = { message: 'Cannot be blank' };
	const validator = required( config );

	describe( 'when the value is not falsy', () => {
		it( 'succeeds the validation', () => {
			expectSuccessfulValidation( validator( 'something' ) );
		} );
	} );

	describe( 'when the value is falsy', () => {
		it( 'fails the validation', () => {
			expectFailedValidation( validator( '' ), config.message );
		} );
	} );

	itIncludesTheLabelInTheErrorMessage( {
		validatorBuilder: message => required( { message } ),
		sampleInvalidValue: ''
	} );
} );

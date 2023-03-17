import { cloneDeep } from 'lodash';
import config, { configure } from '../src/config';

describe( 'configure', () => {
	it( 'replaces the given entries in the config object with the values provided', () => {
		const oldConfig = cloneDeep( config );
		const newConfigOptions = {
			validators: {
				required: { message: 'Cannot be blank' },
				minLength: { message: 'Too short' }
			}
		};

		configure( newConfigOptions );

		expect( config ).toEqual( {
			...oldConfig,
			validators: {
				...oldConfig.validators,
				...newConfigOptions.validators
			}
		} );
	} );
} );

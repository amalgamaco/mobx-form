import { merge } from 'lodash';
import type { Config, ConfigOptions } from './types';

const config: Config = {
	inputs: {
		showErrors: 'onBlur'
	},
	validators: {
		email: { message: 'This email does not have a valid format' },
		length: { message: 'Must have exactly :length characters' },
		maxLength: { message: 'Must have at most :length characters' },
		minLength: { message: 'Must have at least :length characters' },
		required: { message: 'This field is mandatory' }
	}
};

function configure( options: ConfigOptions ) {
	merge( config, options );
}

export default config;
export { configure, type Config, type ConfigOptions };
